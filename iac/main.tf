terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "team1-terraform-state-bucket"
    key            = "global/s3/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "team1-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-west-2"
}

data "aws_ami" "amazon_linux" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

data "aws_vpc" "default" {
  default = true
}

resource "random_pet" "suffix" {
  length    = 2
  separator = "-"
}

output "random_suffix" {
  value = random_pet.suffix.id
}
