# ═══════════════════════════════════════════════════════════════════════
#  AquaEye AI — Terraform Providers and Remote State Configuration
# ═══════════════════════════════════════════════════════════════════════

terraform {
  required_version = ">= 1.5.0"
  
  backend "s3" {
    bucket         = "aquaeye-terraform-state-bucket"
    key            = "production/aquaeye-infrastructure.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "aquaeye-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AquaEye-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
      System      = "Hydrology-Early-Warning"
    }
  }
}
