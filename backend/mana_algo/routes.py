from fastapi import APIRouter
from mana_algo.models import ManaAlgoInput
from mana_algo.services import predict_mana_value

router = APIRouter()

@router.post("/mana-algo/predict")
async def predict_mana_value_route(data: ManaAlgoInput):
    return predict_mana_value(data)
