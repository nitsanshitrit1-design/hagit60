create table if not exists public.journal_comments (
  id uuid primary key default gen_random_uuid(),

  journal_entry_id uuid
    not null
    references public.journal_entries(id)
    on delete cascade,

  nickname text
    not null
    check (
      char_length(trim(nickname))
      between 1 and 40
    ),

  comment text
    not null
    check (
      char_length(trim(comment))
      between 1 and 500
    ),

  created_at timestamptz
    not null
    default now()
);

alter table public.journal_comments
enable row level security;

grant usage on schema public
to anon, authenticated;

grant select, insert
on table public.journal_comments
to anon, authenticated;

drop policy if exists
"journal_comments_public_read"
on public.journal_comments;

create policy
"journal_comments_public_read"
on public.journal_comments
for select
to anon, authenticated
using (true);

drop policy if exists
"journal_comments_public_insert"
on public.journal_comments;

create policy
"journal_comments_public_insert"
on public.journal_comments
for insert
to anon, authenticated
with check (
  char_length(trim(nickname))
    between 1 and 40
  and
  char_length(trim(comment))
    between 1 and 500
);
