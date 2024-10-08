FROM python:3.11

WORKDIR /backend

ENV PYTHONPATH=/backend

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

RUN apt update && apt install -y chromium chromium-driver

COPY pyproject.toml poetry.lock* /backend/

RUN poetry install --no-root --no-cache --only main

COPY . .

CMD ["python", "main.py"]
