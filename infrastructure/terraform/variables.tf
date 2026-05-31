variable "aws_region" {
  type        = string
  description = "AWS deployment region"
  default     = "eu-central-1" # Frankfurt region — closest low-latency zone for Azerbaijan deployments
}

variable "environment" {
  type        = string
  description = "Deployment environment namespace"
  default     = "production"
}

variable "ecr_repository_url" {
  type        = string
  description = "AWS ECR registry URL for the AquaEye FastAPI Docker image"
  default     = "123456789012.dkr.ecr.eu-central-1.amazonaws.com/aquaeye-core"
}

variable "api_key_secret_arn" {
  type        = string
  description = "ARN of the secure api token in AWS Secrets Manager"
  default     = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:aquaeye-api-token"
}
