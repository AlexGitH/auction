# Useful information

## Start the project

### In minikube (locally)

First of all add this one start minikube and switch to its environment

```bash
minikube start
eval $(minikube -p minikube docker-env)
```

Check if the ingress-nginx is running to have ability to connect to the app.

```bash
kubectl get pods --namespace=ingress-nginx
```

The output should be like this:

```txt
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-zb8vm        0/1     Completed   0          29s
ingress-nginx-admission-patch-q92dm         0/1     Completed   0          29s
ingress-nginx-controller-755dfbfc65-p66sm   0/1     Running     0          29s
```

If not please enable ingress Kubectl:

```bash
minikube addons enable ingress
```

Also before running the project check and create the environmental variables.

If you have a script, then just runt it

```sh
bash /tmp/k8s-secrets.sh
```

or manually

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=ExaMpLe
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=StripeExaMpLe
# check
kubectl get secret
```

The output should be something like this:

```text
NAME            TYPE     DATA   AGE
jwt-secret      Opaque   1      19d
stripe-secret   Opaque   1      16s
```

Now we can run the project:

```bash
skaffold dev
```

### Deploy to Digital Ocean(DO) k8s cluster (remote)

Use `doctl` utility to create cluster remotely on DO:

```sh
time doctl kubernetes cluster create alex-do-cluster-11
```

after this you should be connected to correct namespace

```sh
bash tmp/k8s-secrets.sh
```

Apply ingress config for DO.

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/do/deploy.yaml
```

Apply deployment using k8s manifests.

```sh
kubectl apply -f infra/k8s-prod -f infra/k8s
```

Check ingress config on DO site and locally with commands.

```sh
kubectl get services --namespace=ingress-nginx
kubectl describe ingress
```

When ingress controller is configured set corresponding domain name to new load balancer on DO to get access from the internet.

Now site should be available for connection.

### Stop and destroy cluster on DO

Delete deployments using k8s manifests.

```sh
kubectl delete -f infra/k8s-prod -f infra/k8s
```

Wait until all pods are stopped.

Use `doctl` utility to **destroy** cluster remotely on DO:

```sh
time doctl kubernetes delete create alex-do-cluster-11
```

## Installation

### Install basic api packages

#### Auth service packages

```sh
# dependencies
npm i @fairdeal/common @types/cookie-session @types/express @types/jsonwebtoken cookie-session express express-async-errors express-validator jsonwebtoken mongoose ts-node-dev typescript

# dev deps
npm i -D @types/jest @types/supertest jest mongodb-memory-server supertest ts-jest

```

#### Common service packages

```sh
npm i -D del-cli typescript

npm i @types/cookie-session @types/express @types/jsonwebtoken cookie-session express express-validator jsonwebtoken

## this should be installed in final stage
# npm i @types/cookie-session @types/express @types/jsonwebtoken cookie-session express express-validator jsonwebtoken node-nats-streaming

    # "@types/cookie-session": "2.0.44",
    # "@types/express": "4.17.13",
    # "@types/jsonwebtoken": "8.5.9",
    # "cookie-session": "2.0.0",
    # "express": "4.18.2",
    # "express-validator": "6.14.2",
    # "jsonwebtoken": "8.5.1",
    # "node-nats-streaming": "0.3.2"
```

### workable ingress in minikube

it should work after the next command

```sh
minikube addons enable ingress
```

check workability by status

```sh
kubectl describe ingress
```

```txt
Name:             ingress-srv
Labels:           <none>
Namespace:        default
Address:          192.168.49.2
Ingress Class:    nginx
Default backend:  <default>
Rules:
  Host         Path  Backends
  ----         ----  --------
  auction.dev  
               /api/users/?(.*)   auth-srv:3000 (172.17.0.6:3000)
               /?(.*)             client-srv:5000 (172.17.0.3:5000)
Annotations:   nginx.ingress.kubernetes.io/use-regex: true
Events:
  Type    Reason  Age                  From                      Message
  ----    ------  ----                 ----                      -------
  Normal  Sync    101s (x2 over 109s)  nginx-ingress-controller  Scheduled for sync

```
