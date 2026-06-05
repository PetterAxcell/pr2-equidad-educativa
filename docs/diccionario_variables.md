# Diccionario de variables

Este diccionario documenta cada variable por fuente, tipo, unidad, nivel de
análisis y papel en la visualización.

| Variable | Descripción | Fuente | Tipo | Unidad | Nivel | Papel |
| --- | --- | --- | --- | --- | --- | --- |
| `country_code` | Código corto del país o sistema educativo. | Derivado | Categórica nominal | Código | País/sistema | Dimensión/filtro |
| `country` | Nombre del país mostrado en español. | Derivado | Categórica nominal | Texto | País/sistema | Etiqueta |
| `region` | Región comparativa: Europa, América, Asia-Pacífico u Oriente Medio. | Derivado | Categórica nominal | Texto | País/sistema | Filtro/resaltado |
| `ai_use_pct` | Porcentaje de docentes que declaran haber usado IA en su trabajo. | TALIS 2024, Table 1.59 | Cuantitativa continua | % de docentes | País/sistema | Métrica principal |
| `standard_error` | Error estándar del porcentaje de uso de IA. | TALIS 2024, Table 1.59 | Cuantitativa continua | Puntos porcentuales | País/sistema | Calidad/incertidumbre |
| `training_ai_pct` | Porcentaje de docentes cuya formación profesional incluyó IA para enseñanza y aprendizaje. | TALIS 2024, Table 4.22 | Cuantitativa continua | % de docentes | País/sistema | Métrica de preparación |
| `high_need_ai_pct` | Porcentaje de docentes que declaran una necesidad alta de formación en habilidades para usar IA. | TALIS 2024, Table 4.27 | Cuantitativa continua | % de docentes | País/sistema | Métrica de necesidad |
| `need_training_gap` | Diferencia entre necesidad alta y formación recibida sobre IA. | Derivado de TALIS | Cuantitativa continua | Puntos porcentuales | País/sistema | Métrica comparativa |
| `metric_type` | Tipo de percepción: uso, beneficio, riesgo o barrera. | Derivado de TALIS | Categórica nominal | Texto | País/sistema-indicador | Agrupación |
| `metric_key` | Código interno del indicador de percepción. | Derivado de TALIS | Categórica nominal | Texto | País/sistema-indicador | Clave |
| `metric_label` | Etiqueta visible del indicador de percepción. | Derivado | Categórica nominal | Texto | País/sistema-indicador | Etiqueta |
| `value` | Valor porcentual del indicador TALIS o UNESCO. | TALIS/UNESCO | Cuantitativa continua | % | País/sistema-indicador | Métrica |
| `indicator` | Indicador de infraestructura digital escolar. | UNESCO UIS SDG 4 | Categórica nominal | Texto | País-indicador | Dimensión |
| `indicator_label` | Descripción visible del indicador UNESCO. | UNESCO UIS SDG 4 | Categórica nominal | Texto | País-indicador | Etiqueta |
| `year` | Año de medición. | PISA/UNESCO | Temporal discreta | Año | País-año | Dimensión |
| `subject` | Área evaluada en PISA: Matemáticas, Lectura o Ciencias. | PISA | Categórica nominal | Texto | País-año-materia | Filtro |
| `subject_label` | Etiqueta visible de la materia. | Derivado | Categórica nominal | Texto | País-año-materia | Etiqueta |
| `score` | Puntuación media PISA. | PISA 2022 Results, Tables I.B1.5.4-I.B1.5.6 | Cuantitativa continua | Puntos PISA | País-año-materia | Métrica contextual |
| `source` | Fuente original de cada registro. | Derivado | Categórica nominal | Texto | Registro | Trazabilidad |

## Notas de interpretación

- `ai_use_pct` mide uso declarado por docentes, no calidad pedagógica ni impacto
  en aprendizaje.
- `training_ai_pct` y `high_need_ai_pct` se comparan para entender preparación,
  pero no indican por sí solas eficacia de la formación.
- `value` en UNESCO representa disponibilidad de infraestructura digital, no
  intensidad ni calidad del uso.
- `score` contextualiza resultados académicos, pero no prueba causalidad con IA.
- Los valores faltantes se conservan como vacíos en CSV y `null` en JSON; no se interpolan.
