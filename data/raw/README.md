# Fuentes raw

Esta carpeta contiene los ficheros oficiales descargados por
`scripts/prepare_story_data.py`.

- `talis_2024_chapter_1.xlsx`: StatLink oficial de TALIS 2024, capítulo 1. Se
  usa para uso de IA, prácticas, beneficios, riesgos y barreras.
- `talis_2024_chapter_4.xlsx`: StatLink oficial de TALIS 2024, capítulo 4. Se
  usa para formación docente y necesidad alta de formación sobre IA.
- `pisa_2022_volume_1_chapters_5_6.xlsx`: StatLink oficial de PISA 2022
  Results, Volume I, capítulos 5 y 6. Se usa para puntuaciones PISA 2015, 2018
  y 2022.

Los indicadores de infraestructura digital se consultan directamente desde la
API de UNESCO UIS y se guardan ya filtrados en
`data/processed/sdg_digital_infrastructure.csv`.
