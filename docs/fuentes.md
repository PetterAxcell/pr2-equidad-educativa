# Fuentes y trazabilidad

Documento de apoyo para que la visualización pueda auditarse sin depender de
pasos manuales no documentados.

## Fecha de verificación

- Verificación local del pipeline: 2026-06-05.
- No se interpolan valores faltantes; las ausencias se conservan como celdas
  vacías en CSV y `null` en JSON.

## OECD TALIS 2024 Results

Fuente: OECD, *Results from TALIS 2024: The State of Teaching*.

Archivos usados:

- `data/raw/talis_2024_chapter_1.xlsx`
  - URL de descarga: `https://stat.link/files/90df6235-en/fvn03o.xlsx`
  - Tablas usadas:
    - `Table 1.59`: uso de IA por profesorado.
    - `Table 1.60`: prácticas docentes con IA.
    - `Table 1.61`: beneficios percibidos.
    - `Table 1.62`: desafíos percibidos.
    - `Table 1.63`: barreras para usar IA en enseñanza.
- `data/raw/talis_2024_chapter_4.xlsx`
  - URL de descarga: `https://stat.link/files/90df6235-en/0fcxr7.xlsx`
  - Tablas usadas:
    - `Table 4.22`: presencia de IA en actividades de desarrollo profesional.
    - `Table 4.27`: necesidad alta de formación en habilidades para usar IA.

Uso en la visualización: adopción de IA, formación docente, necesidades,
prácticas, beneficios, riesgos y barreras. Se usa ISCED 2 para mantener una
comparación consistente entre sistemas.

## UNESCO UIS SDG 4 Education Indicators

Fuente: UNESCO DataHub, dataset `uis001`.

- Endpoint base:

```text
https://data.unesco.org/api/explore/v2.1/catalog/datasets/uis001/records
```

- Indicadores usados:
  - `SCHBSP.2T3.WINTERN`: proporción de centros de secundaria con acceso a internet para fines pedagógicos.
  - `SCHBSP.2T3.WCOMPUT`: proporción de centros de secundaria con acceso a ordenadores para fines pedagógicos.

Uso en la visualización: preparación digital escolar. Para cada país se toma el
último año disponible publicado en la API.

## OECD PISA 2022 Results, Volume I

Fuente: OECD, PISA 2022 Database, resultados agregados oficiales.

Archivo usado:

- `data/raw/pisa_2022_volume_1_chapters_5_6.xlsx`
  - URL de descarga: `https://stat.link/wh9d4z`
  - Tablas usadas:
    - `Table I.B1.5.4`: puntuaciones medias en Matemáticas.
    - `Table I.B1.5.5`: puntuaciones medias en Lectura.
    - `Table I.B1.5.6`: puntuaciones medias en Ciencias.

Uso en la visualización: contexto de rendimiento académico. La relación con el
uso de IA se presenta como exploratoria y no causal.

## Archivos derivados

- `data/processed/talis_ai_use.csv`: uso de IA por país o sistema.
- `data/processed/talis_ai_training.csv`: formación y necesidad alta de formación.
- `data/processed/talis_ai_perceptions.csv`: usos, beneficios, riesgos y barreras.
- `data/processed/sdg_digital_infrastructure.csv`: infraestructura digital escolar.
- `data/processed/pisa_scores.csv`: puntuaciones PISA por país, año y materia.
- `storytelling/assets/data/story_data.json`: paquete final consumido por la visualización.
