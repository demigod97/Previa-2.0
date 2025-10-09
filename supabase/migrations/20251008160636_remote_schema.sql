create extension if not exists "vector" with schema "public" version '0.8.0';

create type "public"."source_type" as enum ('pdf', 'text', 'website', 'youtube', 'audio');

create sequence "public"."documents_id_seq";

create sequence "public"."n8n_chat_histories_id_seq";

create table "public"."documents" (
    "id" bigint not null default nextval('documents_id_seq'::regclass),
    "content" text,
    "metadata" jsonb,
    "embedding" vector(1536),
    "policyType" text,
    "policyDate" text,
    "policyName" text,
    "source_id" uuid
);


alter table "public"."documents" enable row level security;

create table "public"."n8n_chat_histories" (
    "id" integer not null default nextval('n8n_chat_histories_id_seq'::regclass),
    "session_id" uuid not null,
    "message" jsonb not null
);


alter table "public"."n8n_chat_histories" enable row level security;

create table "public"."notes" (
    "id" uuid not null default uuid_generate_v4(),
    "notebook_id" uuid not null,
    "title" text not null,
    "content" text not null,
    "source_type" text default 'user'::text,
    "extracted_text" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."notes" enable row level security;

create table "public"."policy_documents" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "color" text default 'gray'::text,
    "icon" text default '📝'::text,
    "generation_status" text default 'completed'::text,
    "example_questions" text[] default '{}'::text[],
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "role_assignment" text
);


alter table "public"."policy_documents" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."profiles" enable row level security;

create table "public"."sources" (
    "id" uuid not null default uuid_generate_v4(),
    "notebook_id" uuid not null,
    "title" text not null,
    "type" source_type not null,
    "url" text,
    "file_path" text,
    "file_size" bigint,
    "display_name" text,
    "content" text,
    "summary" text,
    "processing_status" text default 'pending'::text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "visibility_scope" text default 'notebook'::text,
    "target_role" text,
    "uploaded_by_user_id" uuid,
    "policyType" text,
    "policyDate" text,
    "policyName" text
);


alter table "public"."sources" enable row level security;

create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_roles" enable row level security;

alter sequence "public"."documents_id_seq" owned by "public"."documents"."id";

alter sequence "public"."n8n_chat_histories_id_seq" owned by "public"."n8n_chat_histories"."id";

CREATE INDEX documents_embedding_idx ON public.documents USING hnsw (embedding vector_cosine_ops);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE INDEX idx_chat_histories_session_id ON public.n8n_chat_histories USING btree (session_id);

CREATE INDEX idx_notes_notebook_id ON public.notes USING btree (notebook_id);

CREATE INDEX idx_policy_documents_role_assignment ON public.policy_documents USING btree (role_assignment);

CREATE INDEX idx_policy_documents_updated_at ON public.policy_documents USING btree (updated_at DESC);

CREATE INDEX idx_policy_documents_user_id ON public.policy_documents USING btree (user_id);

CREATE INDEX idx_sources_notebook_id ON public.sources USING btree (notebook_id);

CREATE INDEX idx_sources_processing_status ON public.sources USING btree (processing_status);

CREATE INDEX idx_sources_role_sharing ON public.sources USING btree (visibility_scope, target_role) WHERE (visibility_scope = 'role'::text);

CREATE INDEX idx_sources_type ON public.sources USING btree (type);

CREATE INDEX idx_sources_uploaded_by ON public.sources USING btree (uploaded_by_user_id);

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role);

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);

CREATE UNIQUE INDEX n8n_chat_histories_pkey ON public.n8n_chat_histories USING btree (id);

CREATE UNIQUE INDEX notebooks_pkey ON public.policy_documents USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX sources_pkey ON public.sources USING btree (id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."n8n_chat_histories" add constraint "n8n_chat_histories_pkey" PRIMARY KEY using index "n8n_chat_histories_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."policy_documents" add constraint "notebooks_pkey" PRIMARY KEY using index "notebooks_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."sources" add constraint "sources_pkey" PRIMARY KEY using index "sources_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."documents" add constraint "documents_source_id_fkey" FOREIGN KEY (source_id) REFERENCES sources(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_source_id_fkey";

alter table "public"."notes" add constraint "notes_policy_document_id_fkey" FOREIGN KEY (notebook_id) REFERENCES policy_documents(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_policy_document_id_fkey";

alter table "public"."policy_documents" add constraint "notebooks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."policy_documents" validate constraint "notebooks_user_id_fkey";

alter table "public"."policy_documents" add constraint "policy_documents_role_assignment_check" CHECK ((role_assignment = ANY (ARRAY['administrator'::text, 'executive'::text, 'board'::text]))) not valid;

alter table "public"."policy_documents" validate constraint "policy_documents_role_assignment_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."sources" add constraint "sources_policy_document_id_fkey" FOREIGN KEY (notebook_id) REFERENCES policy_documents(id) ON DELETE CASCADE not valid;

alter table "public"."sources" validate constraint "sources_policy_document_id_fkey";

alter table "public"."sources" add constraint "sources_target_role_check" CHECK (((target_role = ANY (ARRAY['administrator'::text, 'executive'::text, 'board'::text])) OR (target_role IS NULL))) not valid;

alter table "public"."sources" validate constraint "sources_target_role_check";

alter table "public"."sources" add constraint "sources_uploaded_by_user_id_fkey" FOREIGN KEY (uploaded_by_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."sources" validate constraint "sources_uploaded_by_user_id_fkey";

alter table "public"."sources" add constraint "sources_visibility_scope_check" CHECK ((visibility_scope = ANY (ARRAY['notebook'::text, 'role'::text, 'global'::text]))) not valid;

alter table "public"."sources" validate constraint "sources_visibility_scope_check";

alter table "public"."user_roles" add constraint "user_roles_role_check" CHECK ((role = ANY (ARRAY['administrator'::text, 'executive'::text, 'board'::text]))) not valid;

alter table "public"."user_roles" validate constraint "user_roles_role_check";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_document_role(document_id uuid, target_role text, user_id_param uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  row_count INTEGER;
BEGIN
  UPDATE public.policy_documents
  SET
    role_assignment = target_role,
    updated_at = NOW()
  WHERE id = document_id
    AND user_id = COALESCE(user_id_param, auth.uid())
    AND target_role IN ('administrator', 'executive');

  GET DIAGNOSTICS row_count = ROW_COUNT;
  RETURN row_count > 0;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.can_user_modify_source(source_id_param uuid, user_id_param uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.sources s
    WHERE s.id = source_id_param
      AND s.uploaded_by_user_id = user_id_param
  );
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
    SELECT role
    FROM public.user_roles
    WHERE user_id = COALESCE(user_id_param, auth.uid())
    ORDER BY
        CASE role
            WHEN 'super_admin' THEN 1
            WHEN 'administrator' THEN 2
            WHEN 'executive' THEN 3
            ELSE 4
        END
    LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id_param uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = COALESCE(user_id_param, auth.uid())
  ORDER BY created_at DESC
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_sources(notebook_id_param uuid, user_role_param text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, notebook_id uuid, title text, type text, content text, summary text, url text, file_path text, file_size bigint, processing_status text, metadata jsonb, visibility_scope text, target_role text, uploaded_by_user_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT
    s.id,
    s.notebook_id,
    s.title,
    s.type,
    s.content,
    s.summary,
    s.url,
    s.file_path,
    s.file_size,
    s.processing_status,
    s.metadata,
    s.visibility_scope,
    s.target_role,
    s.uploaded_by_user_id,
    s.created_at,
    s.updated_at
  FROM public.sources s
  WHERE
    -- Include notebook-specific sources
    s.notebook_id = notebook_id_param
    OR
    -- Include role-shared sources if user has a role
    (
      s.visibility_scope = 'role'
      AND s.target_role = user_role_param
      AND user_role_param IS NOT NULL
    )
  ORDER BY s.created_at DESC;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
    );
    RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(required_role text, user_id_param uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = COALESCE(user_id_param, auth.uid())
        AND role = required_role
    );
$function$
;

CREATE OR REPLACE FUNCTION public.is_policy_document_owner(policy_document_id_param uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.policy_documents
        WHERE id = policy_document_id_param
        AND user_id = auth.uid()
    );
$function$
;

CREATE OR REPLACE FUNCTION public.is_policy_document_owner_for_document(doc_metadata jsonb)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.policy_documents
        WHERE id = (doc_metadata->>'notebook_id')::uuid
        AND user_id = auth.uid()
    );
$function$
;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id_param uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
    SELECT public.has_role('super_admin', user_id_param);
$function$
;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) as similarity
    FROM public.documents
    WHERE documents.metadata @> filter
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$function$
;

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."n8n_chat_histories" to "anon";

grant insert on table "public"."n8n_chat_histories" to "anon";

grant references on table "public"."n8n_chat_histories" to "anon";

grant select on table "public"."n8n_chat_histories" to "anon";

grant trigger on table "public"."n8n_chat_histories" to "anon";

grant truncate on table "public"."n8n_chat_histories" to "anon";

grant update on table "public"."n8n_chat_histories" to "anon";

grant delete on table "public"."n8n_chat_histories" to "authenticated";

grant insert on table "public"."n8n_chat_histories" to "authenticated";

grant references on table "public"."n8n_chat_histories" to "authenticated";

grant select on table "public"."n8n_chat_histories" to "authenticated";

grant trigger on table "public"."n8n_chat_histories" to "authenticated";

grant truncate on table "public"."n8n_chat_histories" to "authenticated";

grant update on table "public"."n8n_chat_histories" to "authenticated";

grant delete on table "public"."n8n_chat_histories" to "service_role";

grant insert on table "public"."n8n_chat_histories" to "service_role";

grant references on table "public"."n8n_chat_histories" to "service_role";

grant select on table "public"."n8n_chat_histories" to "service_role";

grant trigger on table "public"."n8n_chat_histories" to "service_role";

grant truncate on table "public"."n8n_chat_histories" to "service_role";

grant update on table "public"."n8n_chat_histories" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."policy_documents" to "anon";

grant insert on table "public"."policy_documents" to "anon";

grant references on table "public"."policy_documents" to "anon";

grant select on table "public"."policy_documents" to "anon";

grant trigger on table "public"."policy_documents" to "anon";

grant truncate on table "public"."policy_documents" to "anon";

grant update on table "public"."policy_documents" to "anon";

grant delete on table "public"."policy_documents" to "authenticated";

grant insert on table "public"."policy_documents" to "authenticated";

grant references on table "public"."policy_documents" to "authenticated";

grant select on table "public"."policy_documents" to "authenticated";

grant trigger on table "public"."policy_documents" to "authenticated";

grant truncate on table "public"."policy_documents" to "authenticated";

grant update on table "public"."policy_documents" to "authenticated";

grant delete on table "public"."policy_documents" to "service_role";

grant insert on table "public"."policy_documents" to "service_role";

grant references on table "public"."policy_documents" to "service_role";

grant select on table "public"."policy_documents" to "service_role";

grant trigger on table "public"."policy_documents" to "service_role";

grant truncate on table "public"."policy_documents" to "service_role";

grant update on table "public"."policy_documents" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."sources" to "anon";

grant insert on table "public"."sources" to "anon";

grant references on table "public"."sources" to "anon";

grant select on table "public"."sources" to "anon";

grant trigger on table "public"."sources" to "anon";

grant truncate on table "public"."sources" to "anon";

grant update on table "public"."sources" to "anon";

grant delete on table "public"."sources" to "authenticated";

grant insert on table "public"."sources" to "authenticated";

grant references on table "public"."sources" to "authenticated";

grant select on table "public"."sources" to "authenticated";

grant trigger on table "public"."sources" to "authenticated";

grant truncate on table "public"."sources" to "authenticated";

grant update on table "public"."sources" to "authenticated";

grant delete on table "public"."sources" to "service_role";

grant insert on table "public"."sources" to "service_role";

grant references on table "public"."sources" to "service_role";

grant select on table "public"."sources" to "service_role";

grant trigger on table "public"."sources" to "service_role";

grant truncate on table "public"."sources" to "service_role";

grant update on table "public"."sources" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

create policy "Users can create documents in their policy documents"
on "public"."documents"
as permissive
for insert
to public
with check (is_policy_document_owner_for_document(metadata));


create policy "Users can delete documents from their policy documents"
on "public"."documents"
as permissive
for delete
to public
using (is_policy_document_owner_for_document(metadata));


create policy "Users can update documents in their policy documents"
on "public"."documents"
as permissive
for update
to public
using (is_policy_document_owner_for_document(metadata));


create policy "Users can view documents from their policy documents"
on "public"."documents"
as permissive
for select
to public
using (is_policy_document_owner_for_document(metadata));


create policy "Users can create chat histories in their policy documents"
on "public"."n8n_chat_histories"
as permissive
for insert
to public
with check (is_policy_document_owner(session_id));


create policy "Users can delete chat histories from their policy documents"
on "public"."n8n_chat_histories"
as permissive
for delete
to public
using (is_policy_document_owner(session_id));


create policy "Users can view chat histories from their policy documents"
on "public"."n8n_chat_histories"
as permissive
for select
to public
using (is_policy_document_owner(session_id));


create policy "Users can create notes in their policy documents"
on "public"."notes"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM policy_documents
  WHERE ((policy_documents.id = notes.notebook_id) AND (policy_documents.user_id = auth.uid())))));


create policy "Users can delete notes in their policy documents"
on "public"."notes"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM policy_documents
  WHERE ((policy_documents.id = notes.notebook_id) AND (policy_documents.user_id = auth.uid())))));


create policy "Users can update notes in their policy documents"
on "public"."notes"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM policy_documents
  WHERE ((policy_documents.id = notes.notebook_id) AND (policy_documents.user_id = auth.uid())))));


create policy "Users can view notes from their policy documents"
on "public"."notes"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM policy_documents
  WHERE ((policy_documents.id = notes.notebook_id) AND (policy_documents.user_id = auth.uid())))));


create policy "Super admins can view all policy documents"
on "public"."policy_documents"
as permissive
for select
to public
using (is_super_admin());


create policy "Users can create their own policy documents"
on "public"."policy_documents"
as permissive
for insert
to public
with check (((auth.uid() = user_id) OR is_super_admin()));


create policy "Users can delete their own policy documents"
on "public"."policy_documents"
as permissive
for delete
to public
using (((auth.uid() = user_id) OR is_super_admin()));


create policy "Users can update their own policy documents"
on "public"."policy_documents"
as permissive
for update
to public
using (((auth.uid() = user_id) OR is_super_admin()));


create policy "Users can view their own policy documents"
on "public"."policy_documents"
as permissive
for select
to public
using (((auth.uid() = user_id) OR is_super_admin()));


create policy "allow_authenticated_users_policy_documents"
on "public"."policy_documents"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "sources_create_in_own_notebooks"
on "public"."sources"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM policy_documents pd
  WHERE ((pd.id = sources.notebook_id) AND (pd.user_id = auth.uid())))));


create policy "sources_delete_own"
on "public"."sources"
as permissive
for delete
to public
using ((uploaded_by_user_id = auth.uid()));


create policy "sources_delete_policy"
on "public"."sources"
as permissive
for delete
to public
using (((uploaded_by_user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'board'::text))))));


create policy "sources_insert_policy"
on "public"."sources"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "sources_update_own"
on "public"."sources"
as permissive
for update
to public
using ((uploaded_by_user_id = auth.uid()));


create policy "sources_update_policy"
on "public"."sources"
as permissive
for update
to public
using (((uploaded_by_user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'board'::text))))));


create policy "sources_view_own_notebooks"
on "public"."sources"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM policy_documents pd
  WHERE ((pd.id = sources.notebook_id) AND (pd.user_id = auth.uid())))));


create policy "sources_view_policy"
on "public"."sources"
as permissive
for select
to public
using (
CASE
    WHEN (EXISTS ( SELECT 1
       FROM user_roles ur
      WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'board'::text)))) THEN true
    WHEN ((EXISTS ( SELECT 1
       FROM user_roles ur
      WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'executive'::text)))) AND (target_role = ANY (ARRAY['executive'::text, 'administrator'::text]))) THEN true
    WHEN ((EXISTS ( SELECT 1
       FROM user_roles ur
      WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'administrator'::text)))) AND (target_role = 'administrator'::text)) THEN true
    ELSE false
END);


create policy "user_roles_clean_select"
on "public"."user_roles"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policy_documents_updated_at BEFORE UPDATE ON public.policy_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON public.sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


