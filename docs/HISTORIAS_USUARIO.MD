# Historias de Usuario

A partir del documento de requerimientos, se listan las historias de usuario con estructura estándar y hasta cinco criterios de aceptación por historia.

## HU-01: Autenticación de usuario
Como usuario quiero iniciar sesión con mi usuario y clave para acceder a las funcionalidades de la aplicación.

Criterios de aceptación:
1. Dado que estoy en la pantalla de login, cuando ingreso usuario y clave válidos, entonces debo iniciar sesión y recibir un token JWT.
2. Dado que ingreso credenciales inválidas, cuando intento iniciar sesión, entonces debo ver un mensaje de error y no obtener acceso.
3. Dado que estoy autenticado, cuando realizo peticiones al backend, entonces el token JWT debe ser aceptado y validado.
4. Dado que mi sesión expira o el token es inválido, cuando accedo a un recurso protegido, entonces debo ser redirigido al login o recibir un error 401.
5. Dado que cierro sesión, cuando confirmo la acción, entonces el sistema debe invalidar mi sesión localmente.

## HU-02: Ver publicaciones
Como usuario autenticado quiero ver una lista de publicaciones de otros usuarios para mantenerme al tanto de sus actualizaciones.

Criterios de aceptación:
1. Dado que estoy autenticado, cuando abro la pantalla de publicaciones, entonces debo ver un listado paginado de publicaciones ordenadas por fecha (más recientes primero).
2. Dado que una publicación tiene contenido, cuando se muestra en la lista, entonces debo ver el mensaje, usuario autor y fecha de publicación.
3. Dado que no hay publicaciones, cuando abro la pantalla, entonces debo ver un estado vacío indicando que no existen publicaciones.
4. Dado que ocurre un error al cargar, cuando se intenta obtener la lista, entonces debo ver un mensaje de error sin bloquear la aplicación.
5. Dado que navego entre páginas del listado, cuando avanzo o retrocedo, entonces debo ver las publicaciones correspondientes sin duplicados.

## HU-03: Crear publicación
Como usuario autenticado quiero crear una publicación con un mensaje para compartir información con otros usuarios.

Criterios de aceptación:
1. Dado que estoy autenticado, cuando abro el formulario de nueva publicación, entonces debo ingresar un mensaje obligatorio.
2. Dado que envío el formulario con un mensaje válido, cuando confirmo la creación, entonces la publicación debe guardarse con la fecha actual por defecto y asociarse a mi usuario.
3. Dado que la publicación fue creada, cuando vuelvo a la lista, entonces debo ver mi nueva publicación reflejada sin recargar toda la aplicación.
4. Dado que envío un mensaje vacío o inválido, cuando intento crear la publicación, entonces debo ver validaciones que impidan el envío.
5. Dado que ocurre un error en el servidor, cuando intento crear la publicación, entonces debo ver un mensaje de error comprensible.

## HU-04: Dar like a una publicación
Como usuario autenticado quiero dar "like" a publicaciones de otros usuarios para expresar mi aprobación.

Criterios de aceptación:
1. Dado que estoy autenticado, cuando presiono el botón "like" en una publicación, entonces el contador de likes debe incrementarse.
2. Dado que ya di like a una publicación, cuando vuelvo a presionar el botón, entonces no debo poder duplicar el like (idempotencia por usuario).
3. Dado que no estoy autenticado, cuando intento dar like, entonces debo ser redirigido al login o recibir un error 401.
4. Dado que ocurre un error al registrar el like, cuando presiono el botón, entonces debo ver un mensaje de error y el contador no debe cambiar.
5. Dado que el like se registra correctamente, cuando se actualiza la vista, entonces debo ver el total de likes actualizado.

## HU-05: Ver perfil de usuario
Como usuario autenticado quiero ver mi perfil con mis datos personales para consultar mi información.

Criterios de aceptación:
1. Dado que estoy autenticado, cuando accedo a la pantalla de perfil, entonces debo ver Nombres, Apellidos, Fecha de nacimiento y Alias.
2. Dado que mi token es inválido o expiró, cuando intento ver el perfil, entonces debo recibir un error 401 y no mostrar datos.
3. Dado que mi perfil no existe o hay inconsistencia, cuando accedo a la pantalla, entonces debo ver un mensaje claro indicando la situación.
4. Dado que la carga de datos puede demorar, cuando se inicia la consulta, entonces debo ver un indicador de carga hasta obtener la respuesta.
5. Dado que los datos se cargan correctamente, cuando cierro y vuelvo a entrar, entonces debo poder ver los datos consistentes de mi perfil.

## HU-06: Seeder de usuarios de prueba
Como administrador del sistema quiero contar con datos semilla de usuarios con una publicación inicial para facilitar pruebas y demostraciones.

Criterios de aceptación:
1. Dado que la aplicación inicia por primera vez, cuando se ejecuta el seeder, entonces deben crearse usuarios de prueba predefinidos.
2. Dado que se crean usuarios de prueba, cuando se completa el proceso, entonces cada usuario debe tener al menos una publicación asociada.
3. Dado que el seeder ya se ejecutó previamente, cuando se vuelve a iniciar la aplicación, entonces no deben duplicarse los usuarios ni las publicaciones.
4. Dado que ocurre un error durante el seeding, cuando se interrumpe el proceso, entonces debe registrarse el error y abortar de forma segura.
5. Dado que el entorno es de producción, cuando se despliega, entonces el seeder no debe ejecutar datos de prueba por defecto.

## HU-07: Dockerización de microservicios
Como DevOps quiero dockerizar los microservicios para facilitar despliegue y ejecución consistente en distintos entornos.

Criterios de aceptación:
1. Dado que existe un microservicio, cuando genero su imagen Docker, entonces debe construirse correctamente con un Dockerfile por servicio.
2. Dado que tengo múltiples servicios y base de datos, cuando utilizo Docker Compose, entonces debe levantarse el stack completo.
3. Dado que levanto los contenedores, cuando inicio el entorno, entonces los servicios deben estar accesibles mediante sus puertos configurados.
4. Dado que ocurre un error en la construcción, cuando se ejecuta el build, entonces debo ver logs claros que permitan el diagnóstico.
5. Dado que se definen variables de entorno, cuando ejecuto los contenedores, entonces deben cargarse desde archivos .env o variables del sistema.

## HU-08: Persistencia en PostgreSQL
Como desarrollador quiero almacenar datos en PostgreSQL mediante un ORM para garantizar integridad y facilitar el mantenimiento.

Criterios de aceptación:
1. Dado que configuro la base de datos, cuando inicio la aplicación, entonces debe establecerse conexión con PostgreSQL.
2. Dado que defino modelos con un ORM, cuando ejecuto migraciones, entonces deben crearse las tablas necesarias para usuarios, publicaciones y likes.
3. Dado que realizo operaciones CRUD, cuando interactúo con el sistema, entonces los cambios deben persistir correctamente.
4. Dado que ocurren errores de base de datos, cuando se produzcan, entonces deben manejarse con mensajes claros y no romper el servicio.
5. Dado que ejecuto pruebas, cuando levanto un entorno de test, entonces debe utilizarse una base de datos de prueba aislada.

## HU-09: Pantallas del frontend (Login, Perfil, Publicaciones, Crear publicación)
Como usuario quiero contar con pantallas de Login, Perfil, Publicaciones y Crear publicación para interactuar con la red social.

Criterios de aceptación:
1. Dado que abro la aplicación, cuando navego al login, entonces debo poder autenticarme y acceder a las demás pantallas.
2. Dado que estoy autenticado, cuando navego al perfil, entonces debo ver mis datos personales.
3. Dado que estoy autenticado, cuando navego a publicaciones, entonces debo ver la lista con opción de dar like y el total de likes.
4. Dado que estoy autenticado, cuando navego a crear publicación, entonces debo poder crear una publicación con mensaje y fecha por defecto.
5. Dado que no estoy autenticado, cuando intento acceder a pantallas protegidas, entonces debo ser redirigido al login.

## HU-10: Documentación y calidad
Como equipo de desarrollo quiero contar con documentación y calidad técnica para mantener y escalar el proyecto.

Criterios de aceptación:
1. Dado que desarrollo endpoints, cuando documento el backend, entonces debo exponer Swagger con la especificación de cada endpoint.
2. Dado que agrego lógica de negocio, cuando creo pruebas unitarias, entonces deben ejecutarse en CI y reportar cobertura básica.
3. Dado que ocurren errores, cuando se produzcan, entonces deben manejarse siguiendo buenas prácticas y respuestas estandarizadas.
4. Dado que preparo el proyecto para entrega, cuando genero los artefactos, entonces debo incluir README, PDF de instalación y explicación del proyecto.
5. Dado que versiono el código, cuando integro cambios, entonces el repositorio debe contener backend y frontend y scripts para inicialización.
