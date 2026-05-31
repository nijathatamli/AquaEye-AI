# ═══════════════════════════════════════════════════════════════════════
#  AquaEye AI — Terraform Outputs Definitions
# ═══════════════════════════════════════════════════════════════════════

output "vpc_id" {
  description = "The ID of the provisioned secure VPC"
  value       = aws_vpc.main.id
}

output "load_balancer_dns" {
  description = "Public or internal load balancer DNS record for API communication"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "The name of the active ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "The ECS backend service identifier"
  value       = aws_ecs_service.backend.name
}

# Telemetry early warning checkpoint 94
