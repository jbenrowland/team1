provider "aws" {
  region = "us-west-2"
}

data "aws_ami" "amazon_linux" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  owners = ["amazon"]
}

resource "random_pet" "suffix" {
  length    = 2
  separator = "-"
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"

  tags = {
    Name = "Team1-${random_pet.suffix.id}"
  }
}
