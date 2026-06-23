# ⚽ App Fútbol Apuestas

Aplicación móvil/híbrida desarrollada con **Ionic + Angular + Capacitor** para seguir partidos de LaLiga en tiempo real, hacer pronósticos de resultados, consultar la clasificación y competir con otros usuarios en un ranking por puntos.

Es el **frontend** del proyecto; consume una API REST propia desplegada en Vercel ([Back-Proyecto-Futbol](https://back-proyecto-futbol.vercel.app)).

## ✨ Funcionalidades

### Autenticación
- Registro e inicio de sesión con email y contraseña contra el backend propio (JWT).
- Avatar generado automáticamente al registrarse mediante la API de **DiceBear**, con posibilidad de cambiar de estilo o regenerarlo más adelante.
- Sesión persistida con `@capacitor/preferences` e interceptor HTTP que añade el token `Bearer` a cada petición.
- Rutas protegidas con un `authGuard` que redirige a login si no hay token.

### Partidos
- Listado de los partidos de la jornada con escudo de cada equipo, estado (próximamente / en vivo / finalizado) y actualización automática cada 20 segundos.
- Ficha de detalle de partido con marcador y eventos del encuentro (goles).
- Acceso directo al chat del partido desde la ficha de detalle.

### Pronósticos (apuestas)
- Pronóstico del resultado exacto (goles local/visitante) para partidos que aún no han comenzado.
- Solo se permite un pronóstico por partido y por usuario; el sistema avisa si ya existe uno.
- Validación de goles (entre 0 y 20) y confirmación mediante alerta antes de enviar.
- Puntos obtenidos por cada pronóstico acertado, visibles en el perfil del usuario.

### Clasificación de LaLiga
- Tabla de clasificación con posición, partidos jugados/ganados/empatados/perdidos, goles a favor/en contra y diferencia.
- Indicadores visuales por posición (Champions, Europa League, descenso).
- Pull-to-refresh y acceso a la ficha de cada equipo.

### Ficha de equipo
- Plantilla del equipo con avatar, nombre y goles de cada jugador.
- Total de goles marcados por el equipo en la temporada.

### Ranking de usuarios
- Clasificación global de usuarios por puntos acumulados en sus pronósticos, con avatar de cada jugador.

### Perfil
- Datos del usuario organizados en pestañas: información, historial de apuestas y estadísticas.
- Estadísticas personales: apuestas totales, acertadas, falladas, pendientes, % de aciertos y puntos totales.
- Acceso directo desde el historial de apuestas a la ficha del partido correspondiente.
- Cierre de sesión con confirmación.

### Chat por partido
- Chat en tiempo real (por *polling* cada 5 segundos) asociado a cada partido.
- Envío de mensajes con nombre de usuario, distinción visual de mensajes propios y autoscroll al recibir mensajes nuevos.

## 🛠️ Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | Angular 20 (standalone components) |
| UI híbrida | Ionic 8 |
| Empaquetado nativo | Capacitor 8 |
| Lenguaje | TypeScript |
| HTTP | Angular `HttpClient` + interceptor de autenticación |
| Persistencia local | `@capacitor/preferences` |
| Avatares | [DiceBear API](https://www.dicebear.com/) |
| Backend | API REST propia ([Back-Proyecto-Futbol](https://back-proyecto-futbol.vercel.app)) |

## 📂 Estructura del proyecto

```
src/app/
├── guards/         # authGuard: protección de rutas privadas
├── model/          # Interfaces (Match, Bet, Standing, Player, User, Message...)
├── pages/
│   ├── login.page/        # Inicio de sesión
│   ├── register.page/     # Registro
│   ├── tabs/               # Contenedor de pestañas principales
│   ├── matches/            # Listado de partidos de la jornada
│   ├── matches-detail/     # Detalle de partido + pronóstico
│   ├── league/             # Clasificación de LaLiga
│   ├── team-detail/        # Plantilla y goles del equipo
│   ├── ranking/            # Ranking global de usuarios
│   ├── profile/            # Perfil, historial y estadísticas
│   └── chats/               # Chat en vivo por partido
└── services/
    ├── auth.service.ts        # Login, registro, sesión y avatar
    ├── auth.interceptor.ts    # Inyección del token en las peticiones
    ├── soccer.service.ts      # Partidos y clasificación (vista general)
    ├── league.service.ts      # Clasificación, jugadores y goleadores
    ├── bet.service.ts          # Pronósticos del usuario
    ├── chat.service.ts         # Mensajes del chat por partido
    ├── user.service.ts         # Ranking de usuarios
    ├── shield.service.ts       # Mapeo de escudos por equipo
    └── avatar.service.ts       # Generación de avatares (DiceBear)
```

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Comprueba la URL de la API en `src/environments/environment.ts` (desarrollo) y `environment.prod.ts` (producción).
3. Levanta el proyecto en local:
   ```bash
   ionic serve
   ```
   o bien:
   ```bash
   npm start
   ```
4. Para compilar y ejecutar en un dispositivo/emulador con Capacitor:
   ```bash
   ionic build
   npx cap sync
   npx cap run android
   ```

## 📌 Estado del proyecto

Frontend funcional conectado a un backend propio en producción. Algunos eventos de partido (tarjetas, sustituciones) están modelados pero pendientes de implementar en la interfaz.
