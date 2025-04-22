-- Verificar si la columna updated_at existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'teams' AND column_name = 'updated_at'
  ) THEN
    -- Añadir la columna updated_at si no existe
    ALTER TABLE teams ADD COLUMN updated_at TIMESTAMPTZ;
    
    -- Actualizar todos los registros existentes con la fecha actual
    UPDATE teams SET updated_at = NOW();
    
    -- Añadir una restricción NOT NULL
    ALTER TABLE teams ALTER COLUMN updated_at SET NOT NULL;
    
    RAISE NOTICE 'Columna updated_at añadida a la tabla teams';
  ELSE
    RAISE NOTICE 'La columna updated_at ya existe en la tabla teams';
  END IF;
END $$;

-- Crear un trigger para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar el trigger si ya existe
DROP TRIGGER IF EXISTS set_teams_updated_at ON teams;

-- Crear el trigger
CREATE TRIGGER set_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Verificar que todo está correcto
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teams' AND column_name = 'updated_at';

-- Verificar el trigger
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'teams' AND trigger_name = 'set_teams_updated_at';
