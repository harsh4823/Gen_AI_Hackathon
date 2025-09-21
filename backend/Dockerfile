# Stage 1: Build the application with Maven
# Use a base image with Java 21 and Maven
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml file to download dependencies
COPY pom.xml .

# Copy the rest of the source code
COPY src ./src

# Build the project and create the executable JAR
# The '-DskipTests' flag speeds up the build by skipping tests
RUN mvn clean install -DskipTests

# Stage 2: Create the final, lightweight runtime image
# Use a JRE image for a smaller footprint
FROM eclipse-temurin:21-jre

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
# The JAR name is based on your pom.xml (<artifactId>-<version>.jar)
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application will run on (matches server.port)
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]