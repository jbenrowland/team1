# AWS provider using us-west-2 (Oregon)
provider "aws" {
  region = "us-west-2"
}

resource "random_pet" "suffix" {
  length = 2
}

# Fetch latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Use default VPC and subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security group to allow HTTP and SSH
resource "aws_security_group" "web_sg" {
  name        = "web-sg-${random_pet.suffix.id}"
  description = "Allow HTTP and SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 instance running Docker with your image
resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
              yum install git -y
              cd /home/ec2-user

              # Pull and run your Docker image from Docker Hub
              docker pull jbenrowland/team1:latest
              docker run -d -p 80:8080 jbenrowland/team1:latest
              EOF

  tags = {
    Name = "team1-app"
  }
}

# Output the EC2 instance's public IP
output "instance_public_ip" {
  description = "Visit http://<this-ip> to access the app"
  value       = aws_instance.app.public_ip
}
