# Use Kubernetes to Build and Push to Docker Hub

### Build and Push Docker Image

```bash
docker build -t thembaembot/mediciclient:latest .
docker login
docker push thembaembot/mediciclient:latest
```

### Deploy to Kubernetes:

```bash
kubectl apply -f deployment.yaml
```

### Use to expose the application. expose on port 3000

```bash
kubectl port-forward service/mediciclient 3000:80
```

###  Other Kubernetes Commands

```bash
kubectl get pod
kubectl get service
kubectl delete service mediciclient
kubectl delete pod mediciclient
kubectl scale deployment mediciclient --replicas=0
```