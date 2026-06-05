# Metodología

## Alcance

La visualización analiza cómo está entrando la inteligencia artificial en la
educación a partir de 14 países o sistemas con cobertura en TALIS 2024, PISA
2022 y UNESCO UIS. El objetivo no es medir causalmente el impacto de la IA en
el rendimiento, sino comparar cuatro capas:

- adopción y usos docentes de IA;
- formación y necesidad de desarrollo profesional;
- infraestructura digital escolar;
- resultados académicos agregados.

Esta decisión responde al planteamiento de PR1: mantener una visión global,
integrar tecnología e IA y, al mismo tiempo, construir una historia visual
verificable con variables comparables.

## Fuentes

- OECD TALIS 2024 Results: uso, prácticas, beneficios, riesgos, barreras,
  formación y necesidades sobre IA.
- UNESCO UIS SDG 4 Education Indicators: acceso de centros de secundaria a
  internet y ordenadores con fines pedagógicos.
- OECD PISA 2022 Results, Volume I: rendimiento medio en Matemáticas, Lectura
  y Ciencias.

Las URLs, tablas exactas, filtros y fecha de verificación están recogidos en
`docs/fuentes.md`.

## Preparación

El script `scripts/prepare_story_data.py` realiza estas operaciones:

1. Descarga los StatLinks oficiales de TALIS y PISA si no existen en `data/raw`.
2. Extrae uso docente de IA y promedios de referencia de TALIS.
3. Extrae prácticas, beneficios, riesgos y barreras vinculadas a la IA.
4. Extrae formación recibida sobre IA y necesidad alta de formación.
5. Consulta la API de UNESCO para el último dato disponible de infraestructura digital.
6. Extrae puntuaciones medias PISA para 2015, 2018 y 2022.
7. Normaliza nombres, regiones, unidades y códigos de país.
8. Genera CSV procesados y el JSON final de la web.

## Claves de unión

La unión conceptual entre datasets se hace por:

- `country_code`
- `subject` y `year` en PISA
- `indicator` en UNESCO
- `metric_type` y `metric_key` en TALIS

TALIS se usa en ISCED 2 para conservar una base comparable de profesorado de
secundaria obligatoria. UNESCO toma el último año disponible porque no todos los
países publican infraestructura digital en el mismo ciclo.

## Limitaciones

- No se usan microdatos de estudiantes ni de docentes; se trabaja con agregados
  oficiales para mantener viabilidad, reproducibilidad y claridad.
- PISA no mide uso de IA; por eso solo se utiliza como contexto de rendimiento.
- No se afirma causalidad entre IA y resultados académicos.
- La infraestructura digital no equivale a uso pedagógico avanzado de IA; solo
  indica condiciones básicas.
- Algunos valores PISA no están publicados para todos los ciclos. Se conservan
  como no disponibles y no se interpolan.

## Estructura final

- `data/raw`: ficheros oficiales descargados.
- `data/processed`: CSV procesados y resumen de calidad.
- `storytelling/assets/data/story_data.json`: datos finales para la web.
- `storytelling`: visualización narrativa publicable.
