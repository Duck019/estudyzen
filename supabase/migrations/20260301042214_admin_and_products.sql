-- Add is_admin column to profiles
alter table public.profiles add column if not exists is_admin boolean default false not null;

-- Update the handle_new_user function to automatically make specific emails admin
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    case when new.email = 'jaivedvasco@gmail.com' then true else false end
  );
  return new;
end;
$$;

-- Create products table to manage them dynamically
create table if not exists public.products (
  id text primary key,
  title text not null,
  category text not null,
  price text not null,
  image text not null,
  images text[] not null,
  type text not null check (type in ('template', 'slide', 'doc')),
  description text not null,
  features text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for products
alter table public.products enable row level security;

create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Admins can insert products."
  on products for insert
  with check ( exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) );

create policy "Admins can update products."
  on products for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) );

create policy "Admins can delete products."
  on products for delete
  using ( exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) );

-- Insert initial mock data into the products table so the store isn't empty
insert into public.products (id, title, category, price, image, images, type, description, features)
values 
('planner-2025', 'Planner Universitário 2025', 'Notion', 'R$ 29,90', 'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?q=80&w=800&auto=format&fit=crop', array['https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'], 'template', 'O sistema definitivo no Notion para organizar sua vida acadêmica. Chega de perder prazos ou esquecer trabalhos. Este template foi desenhado com uma estética minimalista e clean, focado em produtividade sem distrações.', array['Dashboard central com visão semanal', 'Rastreador de hábitos e rotina', 'Gestor de disciplinas e notas', 'Calendário de provas e entregas', 'Espaço para anotações de aulas (Método Cornell)']),
('pack-slides', 'Pack Slides Minimalistas', 'PowerPoint', 'R$ 45,00', 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'], 'slide', 'Apresente seus trabalhos com confiança. Um pacote com mais de 50 slides editáveis no PowerPoint e Google Slides, criados com princípios de design editorial para impressionar qualquer professor.', array['50+ layouts únicos', 'Fontes gratuitas inclusas', 'Versões claro e escuro', 'Fácil edição de cores e fotos', 'Proporção 16:9 (Widescreen)']),
('resumos-bio', 'Resumos de Biologia', 'PDF', 'R$ 15,90', 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop', array['https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop'], 'doc', 'Mapas mentais e resumos esquematizados de Biologia para o ENEM e vestibulares. Foco nos temas que mais caem, com ilustrações desenhadas à mão e mnemônicos.', array['Mais de 40 mapas mentais', 'Mnemônicos exclusivos', 'Exercícios de fixação', 'Formato otimizado para impressão', 'Atualizado com o edital 2025'])
on conflict (id) do nothing;
