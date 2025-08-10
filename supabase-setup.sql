-- Configuración completa de Supabase para Alianza La Libertad Avanza

-- 1. Habilitar RLS en la tabla posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 2. Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS en perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para la tabla posts
-- Solo admins pueden crear/editar/eliminar
CREATE POLICY "Admins can manage posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Solo editores pueden crear/editar sus propios posts
CREATE POLICY "Editors can manage their posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'editor'
    ) AND author_id = auth.uid()
  );

-- Todos pueden ver posts publicados
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

-- 5. Políticas para la tabla profiles
-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    'editor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Triggers para updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Insertar usuarios de prueba (ejecutar después de crear usuarios en Auth)
-- INSERT INTO profiles (id, name, role) VALUES 
--   ('user-id-del-admin', 'Administrador', 'admin'),
--   ('user-id-del-editor', 'Editor', 'editor');
