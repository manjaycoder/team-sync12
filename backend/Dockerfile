# ==========================================
# Stage 1: Build JAR with Maven & Java 21
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package application
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Minimal Production JRE Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user for security compliance
RUN addgroup -S teamsync && adduser -S teamsync -G teamsync
USER teamsync:teamsync

# Copy compiled jar from build stage
COPY --from=build --chown=teamsync:teamsync /app/target/teamsync-backend-1.0.0.jar app.jar

# Configuration environment defaults
ENV PORT=5001 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

EXPOSE 5001

# Health check using Spring Boot Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5001/actuator/health | grep -q "UP" || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
