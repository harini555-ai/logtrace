# ============================
# Stage 1: Build
# ============================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /build

# Cache dependencies first
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -B clean package -DskipTests

# ============================
# Stage 2: Runtime
# ============================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S logtrace && adduser -S logtrace -G logtrace

# Wildcard *.jar use seivadhil snapshot version issue varaadhu
COPY --from=build /build/target/*.jar app.jar

RUN chown -R logtrace:logtrace /app
USER logtrace

EXPOSE 8080

ENV JAVA_OPTS=""

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]