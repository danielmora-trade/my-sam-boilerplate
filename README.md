# SAM Boilerplate - AWS Serverless API with Aurora Serverless v2

Este es un boilerplate profesional para crear APIs serverless en AWS usando **SAM (Serverless Application Model)**, **Aurora Serverless v2**, **Clean Architecture** y **Lambda Layers** para compartir código entre funciones.

## 🎯 Características Principales

- ✅ **2 APIs completas (CRUD)**: Users y Products
- ✅ **Clean Architecture + SOLID**: Separación clara de responsabilidades
- ✅ **Lambda Layers**: Código compartido centralizado (no duplicado)
- ✅ **Aurora Serverless v2**: Base de datos PostgreSQL serverless
- ✅ **RDS Data API**: Acceso a base de datos sin gestionar conexiones
- ✅ **Secrets Manager**: Credenciales seguras
- ✅ **API Gateway**: 7 endpoints REST configurados
- ✅ **TypeScript**: Tipado fuerte en todo el proyecto
- ✅ **esbuild**: Build optimizado y rápido
- ✅ **Optimizado para costos**: Lambda fuera de VPC

## 🏗️ Arquitectura

### Shared Layer (`/opt/nodejs`)
El layer compartido contiene servicios reutilizables compilados a JavaScript:
- **UuidGeneratorService**: Generación de IDs únicos
- **ApiResponseService**: Respuestas HTTP estandarizadas
- **AuroraDataService**: Clase que implementa un servicio de base de datos para ejecutar consultas y sentencias SQL en Amazon Aurora usando el cliente RDS Data API de AWS.
# my-sam-boilerplate

Boilerplate para proyectos serverless con AWS SAM (Serverless Application Model). Proporciona una plantilla y configuración inicial para desplegar Lambdas en TypeScript, usar Lambda Layers compartidos, y conectar con Aurora Serverless v2 mediante la RDS Data API.

Este README explica cómo usar el proyecto en Windows, macOS o Linux, cómo crear nuevas Lambdas y Layers en TypeScript, los comandos esenciales, y qué ya está preconfigurado en `template.yaml` y `samconfig.toml`.

## ¿Qué incluye este repo?

- Estructura de ejemplo con 2 APIs: `users-api` y `products-api`.
- Función de inicialización de base de datos: `database-init/`.
- Layer compartido en `layers/shared/` con servicios reutilizables.
- `template.yaml` con recursos: VPC, Aurora Serverless (cluster + instancia), Secrets Manager, Layer y funciones Lambda.
- `samconfig.toml` con perfiles `dev` y `prod` ya preparados (parámetros comunes como Environment, DBName, DBMasterUsername y AllowedOrigin).

## Mini-contrato (qué hace este boilerplate)

- Inputs: código TypeScript en cada función / layer, parámetros en `samconfig.toml` o overrides en deploy.
- Outputs esperados: stack CloudFormation con API Gateway, Lambdas, Layer, Aurora y secretos.
- Modo fallos: los despliegues fallarán si no existe configuración AWS válida (credenciales/permisos) o si faltan dependencias en cada paquete.

Edge cases a considerar:
- Si agregas dependencias no incluidas en el Layer, empaqueta o publícalas en cada función.
- Evita importar código desde rutas relativas a la capa; usa el nombre del paquete exportado desde el layer (ver sección Layers).

## Requisitos

- Node.js 22.x (con npm)
- AWS CLI configurado (perfil con permisos para crear IAM, RDS, SecretsManager, Lambda, API Gateway, o bien, AdministratorAccess policy funciona)
- SAM CLI (instrucciones abajo)
- TypeScript (local o global) y esbuild (se usa via SAM Metadata BuildMethod)

### Instalar SAM CLI

Para instrucciones oficiales y opciones (MSI, Homebrew, pipx, apt), revisa: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

Comandos útiles (ejemplos):
- macOS (Homebrew):

```bash
brew tap aws/tap
brew install aws-sam-cli
```

- Linux (distribuciones basadas en Debian/Ubuntu) — preferir el instalador oficial o pipx:

```bash
# revisar la guía oficial; ejemplo con pipx
python3 -m pip install --user pipx
python3 -m pipx install aws-sam-cli
```

- Windows: descarga el instalador MSI desde la documentación oficial o usa Chocolatey:

```powershell
# si tienes Chocolatey
choco install -y aws-sam-cli
```

Nota: sigue la guía oficial si necesitas opciones diferentes o problemas de PATH.

## Preparar el proyecto localmente

1. Clonar el repo:

```bash
git clone <repo-url>
cd my-sam-boilerplate
```

2. Instalar dependencias y compilar capas/funciones antes de build de SAM (recomendado, mas no obligatorio):

- Compilar el layer compartido (ejemplo para este repo):

```bash
cd layers/shared
npm install
npx tsc
cd ../..
```

- Compilar una función (ejemplo `users-api`):

```bash
cd services/users-api
npm install
npx tsc
cd ../..
```

3. Build con SAM (usa esbuild según `template.yaml` Metadata):

```bash
sam build
```

4. Deploy usando el perfil por defecto o un perfil de entorno del `samconfig.toml`:

```bash
# Deploy guiado (crea/actualiza samconfig.toml)
sam deploy --guided

# O usar un perfil de entorno ya definido (ej: dev)
sam deploy --config-env dev
```

### `samconfig.toml` en este repo

El archivo `samconfig.toml` ya define un perfil `dev` y `prod`. Algunas claves ya seteadas:

- `parameter_overrides` incluye: Environment, DBName, DBMasterUsername, AllowedOrigin.
- `region`, `s3_prefix`, y `stack_name` están preconfigurados para `dev` y `prod`.

Puedes lanzar `sam deploy --config-env dev` para usar los valores de `dev`, o sobrescribir parámetros con `--parameter-overrides`.

## Ejecutar y probar localmente

- Levantar la API localmente (mapeará las rutas definidas en `template.yaml`):

```bash
sam local start-api
```

- Invocar una función localmente con un evento de ejemplo:

```bash
sam local invoke CreateUserFunction -e events/event.json
```

- Hacer peticiones HTTP (por ejemplo con curl) contra el endpoint local (por defecto http://127.0.0.1:3000)

```bash
curl -X POST http://127.0.0.1:3000/dev/users -H "Content-Type: application/json" -d '{"name":"Alice"}'
```

## Estructura del `template.yaml` (resumen)

- VPC, Subnets y Security Groups: configurados para Aurora.
- Secrets Manager: `AuroraDBSecret` para credenciales DB.
- Aurora Cluster & Instance: `AuroraDBCluster` y `AuroraDBInstance` (Serverless v2 settings).
- Layer: `SharedDependenciesLayer` con `ContentUri: layers/shared/` y `BuildMethod: nodejs22.x`.
- API Gateway: `ServerlessRestApi` con CORS configurado.
- Lambdas: bloques por función (por ejemplo `CreateUserFunction`, `GetAllUsersFunction`, `CreateProductFunction`), cada uno con:
  - `CodeUri` apuntando a `services/<xyz>/`
  - `Handler` (ej: `app.createUser`)
  - `Runtime: nodejs22.x`
  - `Layers` que referencian `SharedDependenciesLayer`
  - `Metadata.BuildMethod: esbuild` y `BuildProperties` que controlan el empaquetado (EntryPoints, External, Target, Minify...)

Importante: `BuildProperties.External` suele listar `@aws-sdk/*` y `shared` para evitar empaquetar estas dependencias en cada Lambda — se esperan en el layer.

## Cómo agregar una nueva Lambda (paso a paso)

1. Crear directorio de la función: `services/my-new-api/`.
2. Añadir `package.json`, `tsconfig.json`, `app.ts` y carpeta `src/` con capas: `domain`, `application`, `infrastructure`, `presentation` (seguir ejemplo de `users-api`).
3. Exportar el handler desde `app.ts` (ej: `export const createSomething = async (event) => { ... }`).
4. Añadir la función al `template.yaml`. Ejemplo mínimo:

```yaml
MyNewFunction:
  Type: AWS::Serverless::Function
  Properties:
    Layers:
      - !Ref SharedDependenciesLayer
    CodeUri: services/my-new-api/
    Handler: app.createSomething
    Runtime: nodejs22.x
    Environment:
      Variables:
        DB_CLUSTER_ARN: !Sub 'arn:aws:rds:${AWS::Region}:${AWS::AccountId}:cluster:${AuroraDBCluster}'
        DB_NAME: !Ref DBName
    Events:
      MyNewEvent:
        Type: Api
        Properties:
          Path: /my-new
          Method: post
  Metadata:
    BuildMethod: esbuild
    BuildProperties:
      Target: "es2020"
      EntryPoints:
        - app.ts
      External:
        - "@aws-sdk/*"
        - "shared"
```

5. Compilar/Build y Deploy: `sam build && sam deploy --config-env dev` (o `--guided`).

## Cómo añadir/utilizar código o dependencias en el Layer compartido

Preferencias de diseño del layer en este repo:

- Código fuente en: `layers/shared/src/`.
- Archivo de entrada: `layers/shared/src/index.ts` que exporte los servicios públicos.
- `layers/shared/package.json` debe contener el `name` del paquete (por ejemplo `shared`) — ese nombre se usa si las funciones importan por paquete.

Pasos para añadir util o dependencia:

1. Ir a `layers/shared/` y editar/añadir código en `src/`.
2. Exportar desde `src/index.ts` los símbolos que quieras usar.
3. Actualizar `package.json` (version, main si aplica).
4. Instalar dependencias internas si las hay: `npm install` desde `layers/shared`.
5. Compilar: `npx tsc` (o la configuración que uses para la build del layer).
6. Cuando hagas `sam build`, SAM empaquetará `layers/shared/` como `LayerVersion` según `template.yaml`.

Importar desde una Lambda:

- Opción recomendada (cuando `package.json` del layer define `name: "shared"` y el layer se publica con nodejs/node_modules):

```ts
import { ApiResponseService } from 'shared';
```

- Alternativa (ruta absoluta a /opt, disponible en tiempo de ejecución):

```ts
import { ApiResponseService } from '/opt/nodejs';
```

Nota: en `template.yaml` se usa `BuildProperties.External: ["shared"]` para que esbuild no incluya `shared` en el bundle de la Lambda — el código vendrá desde el Layer en tiempo de ejecución.

## Ejemplo mínimo de handler TypeScript que usa el layer

```ts
// services/users-api/app.ts
import { ApiResponseService } from 'shared';

export const createUser = async (event: any) => {
  const body = JSON.parse(event.body || '{}');
  // ... lógica de creación
  return ApiResponseService.success({ id: 'uuid', ...body });
};
```

## Buenas prácticas y consejos

- Mantén el layer lo más pequeño y estable posible (cambios frecuentes en layer implican redeploy de layer y actualización de funciones si dependen de su API).
- Usa `BuildProperties.External` para no empaquetar dependencias que vivirán en el layer.
- Evita poner credenciales en el código; usa `Secrets Manager` y variables de entorno (ya configuradas en `template.yaml`).
- Para cambios rápidos de desarrollo local, usa `sam local start-api` y `sam local invoke`.

## Comprobaciones rápidas (quality gates)

- Build: N/A (solo documentación editada)
- Lint/Typecheck: ejecuta `npm run build` o `npx tsc` dentro de cada paquete si quieres validar.

## Próximos pasos sugeridos

- Añadir scripts NPM que compilen todas las funciones y el layer en un solo paso.
- Incluir tests unitarios mínimos y un pipeline CI que haga `sam build` y `sam validate`.

## Contribuir

Si vas a usar este boilerplate en tu equipo, adapta `samconfig.toml` a los nombres de stacks y buckets que uséis. Siéntete libre de abrir PRs con mejoras y documentación adicional.

---

License: MIT
