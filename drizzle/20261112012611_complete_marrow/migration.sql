ALTER TABLE "giro" ADD COLUMN "giro_anterior_id" uuid;--> statement-breakpoint
ALTER TABLE "giro" ADD CONSTRAINT "giro_anterior_fk" FOREIGN KEY ("giro_anterior_id") REFERENCES "giro"("id");--> statement-breakpoint
ALTER TABLE "giro" ADD CONSTRAINT "giro_regiro_check" CHECK ("e_regiro" = ("giro_anterior_id" IS NOT NULL));