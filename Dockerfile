#imagen base desde la que construiremos nuestra imagen
FROM nginx:latest 

#puerto donde ngnix atiende las solicitudes HTTP dentro del contendor
EXPOSE 80 

# Nginx será el proceso que se ejecutará dentro del contenedor
CMD ["nginx", "-g", "daemon off;"]
