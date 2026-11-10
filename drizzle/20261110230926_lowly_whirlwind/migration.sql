CREATE TYPE "campeonato_status" AS ENUM('AGUARDANDO', 'EM_ANDAMENTO', 'FINALIZADO');--> statement-breakpoint
CREATE TYPE "escalacao_status" AS ENUM('EM_ANDAMENTO', 'FINALIZADA');--> statement-breakpoint
CREATE TYPE "partida_status" AS ENUM('AGUARDANDO', 'FINALIZADA');--> statement-breakpoint
CREATE TABLE "atleta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"time_id" uuid NOT NULL,
	"nome" varchar(100) NOT NULL,
	"nota" integer NOT NULL,
	CONSTRAINT "atleta_nota_check" CHECK ("nota" BETWEEN 1 AND 99)
);
--> statement-breakpoint
CREATE TABLE "campeonato" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" varchar(100) NOT NULL,
	"status" "campeonato_status" DEFAULT 'AGUARDANDO'::"campeonato_status" NOT NULL,
	"data_criacao" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campeonato_participante" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"campeonato_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"escalacao_id" uuid NOT NULL,
	CONSTRAINT "campeonato_usuario_unique" UNIQUE("campeonato_id","usuario_id"),
	CONSTRAINT "campeonato_escalacao_unique" UNIQUE("campeonato_id","escalacao_id")
);
--> statement-breakpoint
CREATE TABLE "escalacao_atleta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"escalacao_id" uuid NOT NULL,
	"posicao_id" uuid NOT NULL,
	"giro_id" uuid NOT NULL CONSTRAINT "escalacao_atleta_giro_unique" UNIQUE,
	"numero_vaga" integer NOT NULL,
	CONSTRAINT "escalacao_atleta_vaga_unique" UNIQUE("escalacao_id","posicao_id","numero_vaga"),
	CONSTRAINT "escalacao_atleta_numero_vaga_check" CHECK ("numero_vaga" BETWEEN 1 AND 2)
);
--> statement-breakpoint
CREATE TABLE "escalacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"usuario_id" uuid NOT NULL,
	"formacao_id" uuid NOT NULL,
	"nome" varchar(100),
	"status" "escalacao_status" DEFAULT 'EM_ANDAMENTO'::"escalacao_status" NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" varchar(20) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "formacao_posicao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"formacao_id" uuid NOT NULL,
	"posicao_id" uuid NOT NULL,
	"quantidade" integer NOT NULL,
	CONSTRAINT "formacao_posicao_unique" UNIQUE("formacao_id","posicao_id"),
	CONSTRAINT "formacao_posicao_quantidade_check" CHECK ("quantidade" > 0)
);
--> statement-breakpoint
CREATE TABLE "giro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"escalacao_id" uuid NOT NULL,
	"time_id" uuid NOT NULL,
	"numero" integer NOT NULL,
	"e_regiro" boolean DEFAULT false NOT NULL,
	CONSTRAINT "giro_escalacao_numero_unique" UNIQUE("escalacao_id","numero")
);
--> statement-breakpoint
CREATE TABLE "partida" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"campeonato_id" uuid NOT NULL,
	"participante_a_id" uuid NOT NULL,
	"participante_b_id" uuid NOT NULL,
	"vencedor_id" uuid,
	"placar_a" integer,
	"placar_b" integer,
	"rodada" integer NOT NULL,
	"status" "partida_status" DEFAULT 'AGUARDANDO'::"partida_status" NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partida_participantes_diferentes" CHECK ("participante_a_id" <> "participante_b_id"),
	CONSTRAINT "partida_placar_a_check" CHECK ("placar_a" IS NULL OR "placar_a" >= 0),
	CONSTRAINT "partida_placar_b_check" CHECK ("placar_b" IS NULL OR "placar_b" >= 0),
	CONSTRAINT "partida_rodada_check" CHECK ("rodada" > 0)
);
--> statement-breakpoint
CREATE TABLE "posicao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" varchar(50) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "time" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" varchar(100) NOT NULL,
	"ano" integer NOT NULL,
	CONSTRAINT "time_nome_ano_unique" UNIQUE("nome","ano")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nome" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"senha" varchar(255) NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "atleta" ADD CONSTRAINT "atleta_time_fk" FOREIGN KEY ("time_id") REFERENCES "time"("id");--> statement-breakpoint
ALTER TABLE "campeonato_participante" ADD CONSTRAINT "campeonato_participante_campeonato_fk" FOREIGN KEY ("campeonato_id") REFERENCES "campeonato"("id");--> statement-breakpoint
ALTER TABLE "campeonato_participante" ADD CONSTRAINT "campeonato_participante_usuario_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "campeonato_participante" ADD CONSTRAINT "campeonato_participante_escalacao_fk" FOREIGN KEY ("escalacao_id") REFERENCES "escalacao"("id");--> statement-breakpoint
ALTER TABLE "escalacao_atleta" ADD CONSTRAINT "escalacao_atleta_escalacao_fk" FOREIGN KEY ("escalacao_id") REFERENCES "escalacao"("id");--> statement-breakpoint
ALTER TABLE "escalacao_atleta" ADD CONSTRAINT "escalacao_atleta_posicao_fk" FOREIGN KEY ("posicao_id") REFERENCES "posicao"("id");--> statement-breakpoint
ALTER TABLE "escalacao_atleta" ADD CONSTRAINT "escalacao_atleta_giro_fk" FOREIGN KEY ("giro_id") REFERENCES "giro"("id");--> statement-breakpoint
ALTER TABLE "escalacao" ADD CONSTRAINT "escalacao_usuario_fk" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id");--> statement-breakpoint
ALTER TABLE "escalacao" ADD CONSTRAINT "escalacao_formacao_fk" FOREIGN KEY ("formacao_id") REFERENCES "formacao"("id");--> statement-breakpoint
ALTER TABLE "formacao_posicao" ADD CONSTRAINT "formacao_posicao_formacao_fk" FOREIGN KEY ("formacao_id") REFERENCES "formacao"("id");--> statement-breakpoint
ALTER TABLE "formacao_posicao" ADD CONSTRAINT "formacao_posicao_posicao_fk" FOREIGN KEY ("posicao_id") REFERENCES "posicao"("id");--> statement-breakpoint
ALTER TABLE "giro" ADD CONSTRAINT "giro_escalacao_fk" FOREIGN KEY ("escalacao_id") REFERENCES "escalacao"("id");--> statement-breakpoint
ALTER TABLE "giro" ADD CONSTRAINT "giro_time_fk" FOREIGN KEY ("time_id") REFERENCES "time"("id");--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_campeonato_fk" FOREIGN KEY ("campeonato_id") REFERENCES "campeonato"("id");--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_participante_a_fk" FOREIGN KEY ("participante_a_id") REFERENCES "campeonato_participante"("id");--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_participante_b_fk" FOREIGN KEY ("participante_b_id") REFERENCES "campeonato_participante"("id");--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_vencedor_fk" FOREIGN KEY ("vencedor_id") REFERENCES "campeonato_participante"("id");