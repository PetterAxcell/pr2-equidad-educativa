# PR2 - IA y educación

Proyecto de visualización de datos para la asignatura **Visualización de datos**. La pieza final es una web narrativa interactiva sobre cómo la inteligencia artificial está entrando en la educación y qué diferencias aparecen entre adopción docente, formación, infraestructura digital y resultados académicos.

## Visualización

- Web publicada: `https://petteraxcell.github.io/pr2-equidad-educativa/`
- Código fuente: `https://github.com/PetterAxcell/pr2-equidad-educativa`

Pregunta principal:

> ¿Cómo está afectando la inteligencia artificial al mundo de la educación y qué condiciones explican que su adopción sea desigual entre sistemas educativos?

## Estado del proyecto

La PR1 planteaba una visión global de la educación con especial atención al papel creciente de la inteligencia artificial. La PR2 responde a ese objetivo con una pieza narrativa que integra varias capas de datos:

- **IA educativa:** uso docente, prácticas, beneficios, riesgos y barreras.
- **Formación docente:** presencia de IA en actividades de desarrollo profesional y necesidad alta de formación.
- **Preparación digital:** acceso de centros de secundaria a internet y ordenadores con finalidad pedagógica.
- **Resultados académicos:** puntuaciones PISA 2022 en Matemáticas, Lectura y Ciencias.

La visualización evita una lectura causal simplista: PISA contextualiza los resultados, pero no demuestra que más uso de IA produzca automáticamente mejor rendimiento.

## Estructura

```text
.
|-- README.md
|-- LICENSE
|-- requirements.txt
|-- data/
|   |-- raw/
|   `-- processed/
|-- docs/
|   |-- diccionario_variables.md
|   |-- fuentes.md
|   |-- metodologia.md
|   `-- storyboard.md
|-- scripts/
|   `-- prepare_story_data.py
|-- storytelling/
|   |-- index.html
|   `-- assets/
|       |-- css/
|       |-- data/
|       |-- js/
|       `-- vendor/
```

## Datos

Archivos procesados:

- `data/processed/talis_ai_use.csv`: porcentaje de docentes que declaran haber usado IA.
- `data/processed/talis_ai_training.csv`: formación recibida sobre IA y necesidad alta de formación.
- `data/processed/talis_ai_perceptions.csv`: usos, beneficios, riesgos y barreras de la IA educativa.
- `data/processed/sdg_digital_infrastructure.csv`: internet y ordenadores pedagógicos en centros de secundaria.
- `data/processed/pisa_scores.csv`: puntuaciones medias PISA por país, año y materia.
- `storytelling/assets/data/story_data.json`: datos finales consumidos por la web.

Fuentes principales:

- OECD TALIS 2024 Results, tablas 1.59 a 1.63, 4.22 y 4.27.
- UNESCO UIS SDG 4 Education Indicators, indicador 4.a.1.
- OECD PISA 2022 Results, Volume I, StatLinks capítulos 5 y 6.

La trazabilidad detallada de fuentes, URLs, tablas y fecha de verificación está documentada en `docs/fuentes.md`.

## Cómo regenerar los datos

Desde la raíz del proyecto:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 scripts/prepare_story_data.py
```

El script descarga los ficheros oficiales si faltan, consulta la API de UNESCO y vuelve a generar los CSV y el JSON.

## Cómo ejecutar la visualización

Desde la carpeta `storytelling`:

```bash
python3 -m http.server 8000
```

Abrir:

```text
http://localhost:8000
```

## Licencia

El código se publica bajo licencia MIT. Ver `LICENSE`.
