FROM maven AS build
COPY . .
ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8092
RUN mvn -f pom.xml clean package -DskipTests
RUN mv target/*.jar app.jar
ENTRYPOINT ["java","-jar", "app.jar"]
