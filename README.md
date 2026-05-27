# ShopCare — gestion de véhicules

Application full-stack de gestion de véhicules intégrant un assistant IA et un générateur d'annonces marketing, déployée via Docker Compose.

**Auteur :** Hajar Braidi 

---

##  Prérequis


> Docker Desktop doit être **démarré** avant toute commande.

---
##  Fonctionnalités démontrées

- **CRUD complet** sur les véhicules (Create, Read, Update, Delete)
- **Assistant IA conversationnel** — recommandations basées sur le stock réel
- **Générateur marketing IA** — annonces publicitaires automatiques
- **IA 100% locale** — aucune clé API, aucune donnée envoyée à l'extérieur
- **Containerisation complète** — Docker Compose prêt à l'emploi
- **Architecture microservices** — 5 services indépendants

---

## Lancement en 3 étapes

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/HajarBraidi/Spring-boot-AppVoitures.git
cd cars-project
```

### Étape 2 — Lancer l'application

```bash
docker compose up --build
```

> **Le premier lancement dure 10 à 20 minutes** — Docker télécharge les images et le modèle IA TinyLlama (~600 MB). Les lancements suivants sont rapides.



### Étape 3 — Ouvrir l'application

| Service         | URL | Description |
|-----------------|---|---|
| **Frontend**    | http://localhost:3030 | Interface principale |
| **Backend API** | http://localhost:8085/api/voitures | API REST |
| **Ollama**      | http://localhost:11434 | Serveur IA |

---


## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Utilisateur                        │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│           Frontend React  :3030                       │
└─────────────────────┬────────────────────────────────┘
                      │ HTTP /api
┌─────────────────────▼────────────────────────────────┐
│         Backend Spring Boot  :8085                    │
│              REST API + Spring AI                     │
└──────────┬──────────────────────┬────────────────────┘
           │                      │
┌──────────▼──────────┐  ┌────────▼────────────────────┐
│   MariaDB  :3306    │  │     Ollama  :11434           │
│   Base de données   │  │   IA locale (TinyLlama)      │
└─────────────────────┘  └─────────────────────────────┘
```

---



---

##  API REST — Endpoints

### Gestion des voitures

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/voitures` | Liste de tous les véhicules |
| `POST` | `/api/voitures` | Ajouter un véhicule |
| `PUT` | `/api/voitures/{id}` | Modifier un véhicule |
| `DELETE` | `/api/voitures/{id}` | Supprimer un véhicule |

### Intelligence Artificielle

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/voitures/assistant` | Conseil IA (body: texte libre) |
| `GET` | `/api/voitures/{id}/marketing` | Génération d'annonce IA |

**Exemple de test API rapide :**
```bash
# Lister les voitures
curl http://localhost:8085/api/voitures

# Demander un conseil à l'IA
curl -X POST http://localhost:8085/api/voitures/assistant \
  -H "Content-Type: text/plain" \
  -d "Je cherche une voiture rouge"
```

---

##  Services Docker

| Container | Image | Port | Rôle |
|---|---|---|---|
| `mariadb_cars` | mariadb:11 | 3306 | Base de données |
| `ollama_cars` | ollama/ollama | 11434 | Serveur IA |
| `ollama_setup` | ollama/ollama | — | Téléchargement TinyLlama (one-shot) |
| `spring_backend` | cars-project-backend | 8085 | API REST |
| `react_frontend` | cars-project-frontend | 3030 | Interface web |

---

##  Arrêter l'application

```bash
# Arrêter les containers (données conservées)
docker compose down

# Arrêter ET supprimer toutes les données
docker compose down -v
```

---

## ⚙ Technologies utilisées

| Couche | Technologie |
|---|---|
| Frontend | React.js, Bootstrap 5 |
| Backend | Spring Boot 3, Spring AI |
| Base de données | MariaDB 11 |
| Intelligence Artificielle | Ollama + TinyLlama (local, sans API externe) |
| Infrastructure | Docker, Docker Compose |
| Orchestration | Kubernetes / minikube |

---

## Architecture Kubernetes

```text
                    ┌─────────────────────────────────┐
                    │      Namespace: miolacar        │
                    │                                 │
                    │  ┌──────────────────────────┐   │
                    │  │         Ingress          │   │
                    │  │  /      → frontend-svc   │   │
                    │  │  /api/* → backend-svc    │   │
                    │  └────────────┬────────────┘   │
                    │        ┌──────┴───────┐        │
                    │  ┌─────▼──────┐ ┌────▼──────┐ │
                    │  │ Deployment │ │ Deployment│ │
                    │  │  frontend  │ │  backend  │ │
                    │  │   React    │ │ Spring AI │ │
                    │  └────────────┘ └────┬──────┘ │
                    │                 ┌────┴────┐    │
                    │          ┌──────▼──┐ ┌────▼──┐ │
                    │          │Stateful │ │Deploy.│ │
                    │          │ MariaDB │ │Ollama │ │
                    │          │ + PVC   │ │ + PVC │ │
                    │          └─────────┘ └───────┘ │
                    │                                 │
                    │  ┌──────────┐ ┌─────────────┐  │
                    │  │ Secret   │ │ ConfigMap  │  │
                    │  │ Password │ │ Networking │  │
                    │  └──────────┘ └─────────────┘  │
                    └─────────────────────────────────┘
```

## Démarrage Minikube

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

## Docker Env

### Linux / Mac

```bash
eval $(minikube docker-env)
```

### Windows PowerShell

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

## Build des images

```bash
docker build -t miolacar-backend:latest ./backend-spring
docker build -t miolacar-frontend:latest ./frontend-react
```

## Charger Ollama

```bash
docker pull ollama/ollama

docker save ollama/ollama -o ollama.tar

minikube image load ollama.tar

rm ollama.tar
```

## Activer Ingress

```bash
minikube addons enable ingress
```

## Déploiement Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
```

### MariaDB

```bash
kubectl apply -f k8s/mariadb/pvc.yaml
kubectl apply -f k8s/mariadb/statefulset.yaml
kubectl apply -f k8s/mariadb/service.yaml
```

### Ollama

```bash
kubectl apply -f k8s/ollama/pvc.yaml
kubectl apply -f k8s/ollama/deployment.yaml
kubectl apply -f k8s/ollama/service.yaml
kubectl apply -f k8s/ollama/job-setup.yaml
```

### Backend

```bash
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
```

### Frontend

```bash
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

### Ingress

```bash
kubectl apply -f k8s/ingress.yaml
```

## Vérification

```bash
kubectl get all -n miolacar
kubectl get pods -n miolacar -w
```

## Logs

```bash
kubectl logs -f <pod-name> -n miolacar
```

## Tunnel Minikube

```bash
minikube tunnel
```

## URLs

- Frontend : http://localhost
- Backend : http://localhost/api/voitures
- Swagger : http://localhost/swagger-ui.html

## Reset

```bash
kubectl delete -R -f k8s/

minikube delete
```
## Hajar BRAIDI