# PetStay Backend Boundary

This folder reserves the production Django/DRF service boundary described in `docs/architecture.md`. The current repository does not yet include Python dependencies or deployment secrets, so backend services should be initialized here rather than mixed into the static client.

Recommended first setup:

```bash
python -m venv .venv
. .venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt psycopg[binary] django-filter django-cors-headers channels channels-redis celery redis drf-spectacular
```

Create the project with domain apps under `apps/`, use environment variables for database/storage/payment settings, and add migrations before loading demo data. Do not copy gateway credentials into source control.
