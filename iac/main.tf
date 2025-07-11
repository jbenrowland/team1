#AWS provider using us-west-2 (Oregon)
provider "aws" {
  region = "us-west-2"
}

resource "random_pet" "suffix" {
  length = 2
}

#Fetch latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

#Use default VPC and subnet
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

#Security group that allows only HTTP traffic (no SSH)
resource "aws_security_group" "web_sg" {
  name        = "web-sg-${random_pet.suffix.id}"
  description = "Allow HTTP traffic only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { #allow ssh
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

#EC2 instance that builds and runs your Docker app
resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  # User data script to deploy the app from GitHub
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
              yum install git -y
              cd /home/ec2-user

              # grab the docker image from dockerhub. We need to make sure we update the user name
              docker pull jbenrowland/team1:latest
              docker run -d -p 80:8080 jbenrowland/team1:latest


              EOF
  tags = {
    Name = "team1"
  }
}
#Output the public IP address so you can access the app
output "instance_public_ip" {
  description = "Visit http://<this-ip> to access the app"
  value       = aws_instance.app.public_ip
}
