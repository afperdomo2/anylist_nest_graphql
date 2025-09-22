# 📝 AnyList - Lista de Compras NestJS GraphQL

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg" width="120" alt="GraphQL Logo" />
</p>

<p align="center">
  API de lista de compras desarrollada con <strong>NestJS</strong>, <strong>GraphQL</strong>, <strong>TypeORM</strong> y <strong>PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
</p>

## 📋 Descripción

Una aplicación moderna de lista de compras que permite a los usuarios gestionar sus compras de manera eficiente. Desarrollada con tecnologías de vanguardia como NestJS para el backend, GraphQL para las consultas flexibles, y PostgreSQL como base de datos.

## 🚀 Características Principales

### 👥 Gestión de Usuarios

- ✅ Registro y autenticación de usuarios con JWT
- ✅ Sistema de roles (Usuario, Admin, SuperAdmin)
- ✅ Encriptación segura de contraseñas con bcrypt
- ✅ Validación de tokens y protección de rutas

### 🛍️ Gestión de Items

- ✅ Crear, leer, actualizar y eliminar items
- ✅ Especificar unidades de medida para cada item
- ✅ Búsqueda y paginación de items
- ✅ Asociación de items con usuarios

### 📝 Gestión de Listas

- ✅ Crear listas de compras personalizadas
- ✅ Agregar items a las listas con cantidades específicas
- ✅ Marcar items como completados
- ✅ Búsqueda y filtrado de listas

### 🔧 Características Técnicas

- ✅ API GraphQL con schema automático
- ✅ Base de datos PostgreSQL con TypeORM
- ✅ Validación de datos con class-validator
- ✅ Configuración de entorno con validaciones
- ✅ Sistema de seeds para datos de prueba
- ✅ Documentación automática con Swagger

## 🏗️ Arquitectura del Proyecto

### 📁 Estructura de Módulos

```
src/
├── 🔐 auth/             # Autenticación y autorización
├── 🛠️ common/           # Utilidades compartidas
├── ⚙️ config/           # Configuraciones
├── 🗄️ database/         # Configuración de base de datos
├── 🌐 envs/             # Variables de entorno
├── 📊 graphql/          # Configuración GraphQL
├── 📦 modules/          # Módulos de negocio
│   ├── 👤 users/        # Gestión de usuarios
│   ├── 🛍️ items/        # Gestión de items
│   ├── 📝 lists/        # Gestión de listas
│   └── 🔗 item-lists/   # Relación items-listas
└── 🌱 seed/             # Datos de prueba
```

### 🗃️ Entidades de Base de Datos

#### 👤 User (Usuario)

```typescript
- id: UUID
- fullName: string
- email: string (único)
- password: string (encriptado)
- roles: UserRole[]
- isActive: boolean
- createdAt: Date
- updatedAt: Date
```

#### 🛍️ Item (Artículo)

```typescript
- id: UUID
- name: string
- description?: string
- unitOfMeasurement: string
- userId: UUID (FK)
```

#### 📝 List (Lista)

```typescript
- id: UUID
- name: string
- userId: UUID (FK)
```

#### 🔗 ItemList (Items en Lista)

```typescript
- id: UUID
- listId: UUID (FK)
- itemId: UUID (FK)
- quantity: number
- isCompleted: boolean
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | ^11.0.1 | Framework backend modular |
| **GraphQL** | ^16.11.0 | API query language flexible |
| **TypeORM** | ^0.3.26 | ORM para PostgreSQL |
| **PostgreSQL** | - | Base de datos relacional |
| **JWT** | ^11.0.0 | Autenticación stateless |
| **bcrypt** | ^6.0.0 | Encriptación de contraseñas |
| **class-validator** | ^0.14.2 | Validación de datos |
| **Joi** | ^18.0.1 | Validación de configuración |

## ⚙️ Configuración e Instalación

### 📋 Prerrequisitos

- Node.js (≥ 18.x)
- PostgreSQL (≥ 13.x)
- npm o yarn

### 🔧 Instalación

1. **Clona el repositorio**

```bash
git clone <repository-url>
cd anylist_nest_graphql
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tu configuración
ENVIRONMENT=development
PORT=3000
JWT_SECRET=tu_super_secreto_jwt
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=anylist_db
```

4. **Configura la base de datos**

```bash
# Crea la base de datos en PostgreSQL
createdb anylist_db
```

## 🚀 Ejecución del Proyecto

### 🏃‍♂️ Modo Desarrollo

```bash
# Iniciar en modo desarrollo (recarga automática)
npm run start:dev

# Iniciar en modo debug
npm run start:debug
```

### 🏭 Modo Producción

```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

### 🌱 Poblar Base de Datos

```bash
# Ejecutar seeds desde GraphQL Playground
mutation {
  executeSeed
}
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📊 GraphQL Playground

Una vez iniciado el servidor, puedes acceder a:

- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Swagger Documentation**: `http://localhost:3000/api/docs`

### 🔍 Consultas de Ejemplo

#### Autenticación

```graphql
# Registro de usuario
mutation {
  createUser(createUserInput: {
    fullName: "Juan Perez"
    email: "juan@example.com"
    password: "Password123"
  }) {
    id
    fullName
    email
    roles
  }
}

# Obtener todos los usuarios (Solo Admin)
query {
  users {
    id
    fullName
    email
    roles
    isActive
  }
}
```

#### Items y Listas

```graphql
# Crear un item
mutation {
  createItem(createItemInput: {
    name: "Leche"
    unitOfMeasurement: "litros"
    description: "Leche entera"
  }) {
    id
    name
    unitOfMeasurement
  }
}

# Crear una lista
mutation {
  createList(createListInput: {
    name: "Lista del Supermercado"
  }) {
    id
    name
    user {
      fullName
    }
  }
}

# Agregar item a lista
mutation {
  createItemList(createItemListInput: {
    listId: "uuid-de-lista"
    itemId: "uuid-de-item"
    quantity: 2
    isCompleted: false
  }) {
    id
    quantity
    isCompleted
    item {
      name
    }
    list {
      name
    }
  }
}
```

## 🔒 Sistema de Autenticación

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **User** | Ver y gestionar sus propios items y listas |
| **Admin** | Gestionar usuarios + permisos de User |
| **SuperAdmin** | Todos los permisos del sistema |

### Protección de Rutas

- 🌐 **Público**: Consultas sin autenticación
- 🔒 **Usuario Autenticado**: Requiere JWT válido
- 🔑 **Solo Administradores**: Requiere rol Admin/SuperAdmin

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start` | Inicia la aplicación |
| `npm run start:dev` | Modo desarrollo con recarga automática |
| `npm run start:debug` | Modo debug |
| `npm run start:prod` | Modo producción |
| `npm run build` | Compila el proyecto |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea código con Prettier |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:e2e` | Ejecuta tests end-to-end |

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de conexión a base de datos**

```bash
# Verificar que PostgreSQL esté ejecutándose
pg_isready

# Verificar variables de entorno
echo $DB_HOST $DB_PORT $DB_USER $DB_NAME
```

**Error JWT_SECRET**

```bash
# Asegurar que JWT_SECRET esté configurado en .env
JWT_SECRET=tu_super_secreto_jwt_muy_largo_y_seguro
```

**Error de puerto en uso**

```bash
# Cambiar puerto en .env o terminar proceso
PORT=3001
# o
lsof -ti:3000 | xargs kill
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia UNLICENSED - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

- **Andrés Felipe Perdomo** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Framework Node.js progresivo
- [GraphQL](https://graphql.org/) - Lenguaje de consulta para APIs
- [TypeORM](https://typeorm.io/) - ORM para TypeScript y JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Sistema de base de datos relacional
