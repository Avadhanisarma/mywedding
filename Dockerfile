FROM python:3.9-slim-buster

WORKDIR /app

COPY ./backend /app/backend
COPY ./frontend /app/frontend
COPY ./requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "80"]
