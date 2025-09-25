
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
# Neuro Salud

## Integrantes

- Joel Serrudo
- Juan Molina
- Leonel Maurici Martinez
- Mariana Leal
- Maxi Corbalan
- Facundo Visa
- Ivan Giron
- Nicolas Martinelli

## Como arrancar el proyecto

1. Clonar el proyecto
2. Colocarse en la ruta del proyecto y escribir en la misma consola ``` npm i ``` 
3. Ejecutar ```npm run start:dev ```

#### Necesario tener .env con al menos

1. JWT_SECRET_KEY
2. DB_URL

## ¿Queres contribuir?
### Usamos GitHub Flow para realizar los cambios
1. Añadir el repositorio remoto con
   ```
   git remote add [nombre del repositorio remoto ej: origin] [link del repositorio]
   ```
2. Traer la ultima version del proyecto con
  ```
  git pull [nombre del repositorio remoto ej: origin] main
  ```
3. Una vez realizado las nuevas features, subiro a una nueva rama en el repositorio
   ```
   git switch -c feature/[nombre de la caracteristica que hiciste]
   ```
4. Guardar los cambios en esa rama
   ```
   git status #Ves si hay cambios o no
   git add .
   git commit -m "feat:[nombre de la caracteristica]"
   git push [nombre del repositorio remoto ej: origin] feature/[nombre de la caracteristica que hiciste]
   ```
5. Listo!
