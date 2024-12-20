import docker
import subprocess
import configparser
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create a ConfigParser object
config = configparser.ConfigParser()

# Read the configuration file
config.read('config.ini')

# Access the username and password from the configuration file
username = config['credentials']['username']
password = config['credentials']['password']

# Initialize Docker client
client = docker.from_env()

# Function to get container ID
def get_container_id(container_name):
    try:
        container = client.containers.get(container_name)
        return container.id
    except docker.errors.NotFound:
        logging.error(f"Container with name {container_name} not found.")
        return None
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None

# Function to get image tag
def get_image_tag(container_id):
    try:
        container = client.containers.get(container_id)
        repo_tags = container.image.attrs.get('RepoTags')
        if repo_tags:
            image_name, image_tag = repo_tags[0].split(':')
            return image_name, float(image_tag)
        else:
            return None, None
    except docker.errors.NotFound:
        logging.error(f"Container with ID {container_id} not found.")
        return None, None
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None, None

# Function to build image
def image_build(image_name, new_image_tag):
    try:
        logging.info("Building new docker image, this may take some time...")
        client.images.build(tag=f"{image_name}:{new_image_tag}", path="./")
        logging.info(f"Successfully built new image: {image_name}:{new_image_tag}")
    except Exception as e:
        logging.error(f"Failed to build new image: {e}")

# Function to stop and remove container
def stop_and_remove_running_container(container_id):
    try:
        container = client.containers.get(container_id)
        container.stop()
        container.remove()
        logging.info("Successfully stopped and removed the running container")
    except docker.errors.NotFound:
        logging.error("Container not found.")
    except Exception as e:
        logging.error(f"An error occurred: {e}")

# Function to run container
def run_container(image_name, new_image_tag, container_name):
    try:
        client.containers.run(
            image=f"{image_name}:{new_image_tag}",
            name=container_name,
            detach=True,
            restart_policy={"Name": "always"},
            network="hrportal",
            ports={"8765/tcp": 8765}
        )
        logging.info("Successfully created new container with new image build and it's running")
    except docker.errors.APIError as e:
        logging.error(f"Failed to run container: {e}")
    except Exception as e:
        logging.error(f"An error occurred: {e}")

# Function to push image to Docker Hub
def push_image_to_dockerhub(image_name, new_image_tag):
    try:
        client.login(username=username, password=password)
        subprocess.run(f"docker tag {image_name}:{new_image_tag} nandu93/{image_name}:{new_image_tag}", shell=True, check=True)
        client.images.push(f"nandu93/{image_name}", tag=new_image_tag)
        logging.info("Successfully pushed image to Docker Hub")
    except Exception as e:
        logging.error(f"Failed to push image to Docker Hub: {e}")

# Function to delete older images
def delete_older_images(image_name, new_image_tag, image_tag):
    try:
        client.images.remove(f"{image_name}:{image_tag}")
        client.images.remove(f"nandu93/{image_name}:{new_image_tag}")
        logging.info("Successfully removed the older images")
    except docker.errors.NotFound:
        logging.error("There are no older images with these names")
    except Exception as e:
        logging.error(f"An error occurred: {e}")

# Main function
def main():
    container_name = "hrportal-server"
    container_id = get_container_id(container_name)
    if container_id:
        image_name, image_tag = get_image_tag(container_id)
        if image_name and image_tag:
            logging.info(f"The current image used by {container_name} container is {image_name}:{image_tag}")
            new_image_tag = image_tag + 1
            image_build(image_name, new_image_tag)
            stop_and_remove_running_container(container_id)
            run_container(image_name, new_image_tag, container_name)
            push_image_to_dockerhub(image_name, new_image_tag)
            delete_older_images(image_name, new_image_tag, image_tag)

if __name__ == "__main__":
    main()
