curl -H 'Content-Type: application/json' \
      -d '{
            "action": "Create",
            "resource": {
                  "typeId": "customer",
                  "id": "12345"
            }
      }' \
      -X POST localhost:8080/service