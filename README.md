# Regalo de Cumpleanos - Guia de Personalizacion

## Estructura de archivos

```
gift/
├── index.html          <- Pagina principal
├── css/
│   └── style.css       <- Estilos visuales
├── js/
│   └── script.js       <- Logica e interactividad
├── images/
│   ├── foto1.jpg       <- COLOCA AQUI TUS FOTOS
│   ├── foto2.jpg
│   ├── foto3.jpg
│   └── foto4.jpg
└── audio/
    ├── background.mp3  <- Musica de fondo (suena durante toda la experiencia)
    ├── cancion1.mp3
    ├── cancion2.mp3
    ├── cancion3.mp3
    └── cancion4.mp3
```

---

## Como personalizar

### 1. NOMBRE
Abre `js/script.js` y busca:
```js
name: '[NOMBRE]',
```
Cambialo por el nombre real. Ej: `name: 'Sofia',`

### 2. CARTA PERSONAL
Abre `index.html` y busca el bloque:
```html
<!-- AQUI VA MI CARTA -->
```
Reemplaza los parrafos de ejemplo con tu texto real.
Puedes usar tantos `<p>` como quieras.
Cambia tambien el saludo: `Querida [NOMBRE],` y la firma: `[TU NOMBRE]`

### 3. MENSAJE FINAL
En `index.html` busca:
```html
<!-- MENSAJE FINAL -->
```
Reemplaza el parrafo con tu mensaje.

### 4. RECUERDOS (fotos y textos)
En `index.html`, dentro de cada `<article class="memory-card">`:
- Reemplaza `<!-- FECHA 1 -->` con la fecha (ej: "Marzo, 2024")
- Reemplaza `<!-- FRASE CORTA 1 -->` con una frase emotiva breve
- Reemplaza `<!-- TEXTO BREVE 1 -->` con un texto descriptivo (2-4 lineas)

Las fotos van en la carpeta `images/`. Si una imagen no existe, la tarjeta
mostrara automaticamente un placeholder elegante sin romperse.

Puedes eliminar los `<article class="memory-card">` que no necesites.

### 5. CANCIONES
Abre `js/script.js` y edita el arreglo `songs`:
```js
songs: [
  {
    title:       'Nombre de la cancion',
    artist:      'Nombre del artista',
    description: 'Por que elegiste esta cancion',
    src:         'audio/cancion1.mp3'
  },
  ...
]
```
Coloca los archivos `.mp3` en la carpeta `audio/`.
La musica de fondo va en `audio/background.mp3`.

### 6. DETALLES INTERACTIVOS (pantalla 4)
En `index.html` busca los bloques `<!-- DETALLE 1 -->`, `<!-- DETALLE 2 -->`, etc.
Escribe el texto dentro de cada `<p>`.

### 7. MENSAJE SECRETO (sorpresa escondida)
En `js/script.js` busca:
```js
secretMessage: '...',
```
Cambialo por tu mensaje. Usa `\n` para saltos de linea.
La persona debe tocar la pequena estrella 5 veces seguidas para descubrirlo.

---

## Como probar localmente

Opcion A (recomendada): Instala la extension "Live Server" en VS Code
y abre el proyecto. Haz clic en "Go Live".

Opcion B: En la terminal, dentro de la carpeta `gift/`, ejecuta:
```
npx serve .
```
Luego abre `http://localhost:3000` en tu telefono (misma red WiFi).

Opcion C (solo para ver, sin audio): Abre `index.html` directamente
en el navegador. El audio no funcionara por restricciones del navegador
pero el diseno se vera completo.

---

## Como publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser privado o publico)
2. Sube todos los archivos de la carpeta `gift/`:
   ```
   git init
   git add .
   git commit -m "regalo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub, ve a Settings > Pages
4. En "Source" selecciona: `main` / `/ (root)`
5. En unos minutos la pagina estara disponible en:
   `https://TU_USUARIO.github.io/TU_REPO/`

Ese enlace es el que le mandas a la persona.

---

## Notas importantes

- La musica necesita que el usuario haga su primera interaccion (tocar el boton
  "Abrir regalo") para poder reproducirse. Esto es una restriccion de todos
  los navegadores moviles, no es un error.
- Si no tienes fotos para todas las tarjetas, no pasa nada. La pagina
  muestra un placeholder elegante automaticamente.
- Si no tienes canciones todavia, las tarjetas se mostraran vacias.
  Puedes agregar los .mp3 despues y la pagina funcionara igual.
