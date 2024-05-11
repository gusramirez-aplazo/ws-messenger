ifdef MSGR_PORT
	port := $(MSGR_PORT)
else
	port := 8080
endif

ifdef CLOUDFLARE_R2_URL
	cloudflareR2Url := $(CLOUDFLARE_R2_URL)
else
	$(error CLOUDFLARE_R2_URL is not set)
endif

ifdef S3_ACCESS_KEY_ID
	s3AccessKey := $(S3_ACCESS_KEY_ID)
else
	$(error S3_ACCESS_KEY_ID is not set)
endif

ifdef S3_SECRET_ACCESS_KEY
	s3SecretKey := $(S3_SECRET_ACCESS_KEY)
else
	$(error S3_SECRET_ACCESS_KEY is not set)
endif

ifdef MISA_MAPS_URL
	mapsMisaUrl := $(MISA_MAPS_URL)
else
	$(error MISA_MAPS_URL is not set)
endif

ifdef KIDS_WORLD_URL
	kidsWorldUrl := $(KIDS_WORLD_URL)
else
	$(error KIDS_WORLD_URL is not set)
endif

ifdef REGISTRY
	registry := $(REGISTRY)
else
	$(error REGISTRY is not set)
endif

ifdef IMAGE_NAME
	imageName := $(IMAGE_NAME)
else
	$(error IMAGE_NAME is not set)
endif

ifdef GITHUB_SHA
	commitSha := $(shell echo ${GITHUB_SHA} | head -c 7)
else
	commitSha := $(shell git rev-parse HEAD | head -c 7)
endif

ifdef CONTAINER_REGISTRY_USERNAME
	containerRegistryUsername := $(CONTAINER_REGISTRY_USERNAME)
else
	$(error CONTAINER_REGISTRY_USERNAME is not set)
endif

ifdef CONTAINER_REGISTRY_TOKEN
	containerRegistryToken := $(CONTAINER_REGISTRY_TOKEN)
else
	$(error CONTAINER_REGISTRY_TOKEN is not set)
endif

.PHONY build:
build:
	@echo "Building whatsapp messenger..."
	@docker buildx build \
		--build-arg PORT=$(port) \
		-t $(registry)/$(imageName):$(commitSha) \
		.

.PHONY push:
push:
	@echo "Pushing whatsapp messenger..."
	@docker push $(registry)/$(imageName):$(commitSha)

.PHONY login:
login:
	@echo "Logging in to container registry..."
	@docker login -u $(containerRegistryUsername) -p $(containerRegistryToken) registry.digitalocean.com

.PHONY stop:
stop:
	@echo "Stopping messenger app ..."
	@docker stop $(imageName)

.PHONY remove:
remove:
	@echo "Removing messenger app ..."
	@docker rm $(imageName)

.PHONY run:
run:
	@echo "Starting messenger app ..."
	@docker run -it \
		-p 8000:$(port) \
		-e PORT=$(port) \
		-e CLOUDFLARE_R2_URL=$(cloudflareR2Url) \
		-e S3_ACCESS_KEY_ID=$(s3AccessKey) \
		-e S3_SECRET_ACCESS_KEY=$(s3SecretKey) \
		-e MISA_MAPS_URL=$(mapsMisaUrl) \
		-e KIDS_WORLD_URL=$(kidsWorldUrl) \
		--name $(imageName) \
		--cap-add=SYS_ADMIN \
		--restart unless-stopped \
		$(registry)/$(imageName):$(commitSha)
