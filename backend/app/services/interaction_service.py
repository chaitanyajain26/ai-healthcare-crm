from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from app.db.mongodb import get_database
from app.schemas.interaction import HcpHistoryResponse, InteractionCreate, InteractionOut, InteractionUpdate


class InteractionService:
    collection_name = "interactions"

    async def list_interactions(
        self,
        hcp_name: str | None = None,
        sentiment: str | None = None,
        limit: int = 100,
    ) -> list[InteractionOut]:
        query: dict[str, Any] = {}
        if hcp_name:
            query["hcp_name"] = {"$regex": hcp_name, "$options": "i"}
        if sentiment:
            query["sentiment"] = sentiment

        try:
            db = get_database()
            cursor = db[self.collection_name].find(query).sort("created_at", -1).limit(limit)
            return [self._serialize(document) async for document in cursor]
        except ServerSelectionTimeoutError as exc:
            raise HTTPException(status_code=503, detail="MongoDB is unavailable. Check MONGO_URI and service health.") from exc
        except PyMongoError as exc:
            raise HTTPException(status_code=500, detail="Unable to list interactions") from exc

    async def get_interaction(self, interaction_id: str) -> InteractionOut:
        object_id = self._object_id(interaction_id)
        db = get_database()
        document = await db[self.collection_name].find_one({"_id": object_id})
        if not document:
            raise HTTPException(status_code=404, detail="Interaction not found")
        return self._serialize(document)

    async def create_interaction(self, payload: InteractionCreate | dict[str, Any]) -> InteractionOut:
        now = datetime.now(timezone.utc)
        document = payload.model_dump(mode="json", by_alias=False) if isinstance(payload, InteractionCreate) else dict(payload)
        document = self._normalize_document(document)
        document["created_at"] = now
        document["updated_at"] = now
        document["updated_fields"] = []

        try:
            db = get_database()
            result = await db[self.collection_name].insert_one(document)
            document["_id"] = result.inserted_id
            await self._write_activity_log("log_interaction", {"interaction_id": str(result.inserted_id)})
            return self._serialize(document)
        except ServerSelectionTimeoutError as exc:
            raise HTTPException(status_code=503, detail="MongoDB is unavailable. Start Docker MongoDB or configure Atlas.") from exc
        except PyMongoError as exc:
            raise HTTPException(status_code=500, detail="Unable to create interaction") from exc

    async def update_interaction(self, interaction_id: str, payload: InteractionUpdate | dict[str, Any]) -> InteractionOut:
        object_id = self._object_id(interaction_id)
        raw_update = payload.model_dump(exclude_unset=True, mode="json", by_alias=False) if isinstance(payload, InteractionUpdate) else dict(payload)
        update_document = self._normalize_document(raw_update)
        update_document = {key: value for key, value in update_document.items() if value is not None}
        if not update_document:
            return await self.get_interaction(interaction_id)

        update_document["updated_at"] = datetime.now(timezone.utc)
        updated_fields = sorted(key for key in update_document.keys() if key != "updated_at")
        update_document["updated_fields"] = updated_fields

        db = get_database()
        result = await db[self.collection_name].find_one_and_update(
            {"_id": object_id},
            {"$set": update_document},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            raise HTTPException(status_code=404, detail="Interaction not found")
        await self._write_activity_log("edit_interaction", {"interaction_id": interaction_id, "updated_fields": updated_fields})
        return self._serialize(result)

    async def fetch_hcp_history(self, hcp_name: str, limit: int = 10) -> HcpHistoryResponse:
        interactions = await self.list_interactions(hcp_name=hcp_name, limit=limit)
        positive_count = sum(1 for item in interactions if item.sentiment == "Positive")
        insights = [
            f"{hcp_name} has {len(interactions)} recorded interactions.",
            f"{positive_count} interactions show positive sentiment.",
            "Review open action items before the next visit." if interactions else "No history found. Start with structured discovery notes.",
        ]
        return HcpHistoryResponse(hcpName=hcp_name, totalInteractions=len(interactions), insights=insights, interactions=interactions)

    async def _write_activity_log(self, event_type: str, payload: dict[str, Any]) -> None:
        try:
            db = get_database()
            await db["ai_activity_logs"].insert_one(
                {"event_type": event_type, "payload": payload, "created_at": datetime.now(timezone.utc)}
            )
        except PyMongoError:
            # Activity logging should never block the core CRM workflow.
            return

    def _serialize(self, document: dict[str, Any]) -> InteractionOut:
        normalized = dict(document)
        normalized["id"] = str(normalized.pop("_id"))
        return InteractionOut(**normalized)

    def _object_id(self, interaction_id: str) -> ObjectId:
        try:
            return ObjectId(interaction_id)
        except InvalidId as exc:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid interaction id") from exc

    def _normalize_document(self, document: dict[str, Any]) -> dict[str, Any]:
        aliases = {
            "hcpName": "hcp_name",
            "interactionType": "interaction_type",
            "topicsDiscussed": "topics_discussed",
            "materialsShared": "materials_shared",
            "followUpActions": "follow_up_actions",
            "aiSummary": "ai_summary",
            "extractedEntities": "extracted_entities",
            "actionItems": "action_items",
            "createdBy": "created_by",
            "updatedFields": "updated_fields",
        }
        return {aliases.get(key, key): value for key, value in document.items()}
