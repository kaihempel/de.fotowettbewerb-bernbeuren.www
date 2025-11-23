import { Head } from "@inertiajs/react";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";
import { Users, Heart, Camera } from "lucide-react";

interface AboutUsProps {
  title: string;
}

export default function AboutUs({ title }: AboutUsProps) {
  return (
    <GlobalLayout>
      <Head title={title} />

      <div className="mx-auto max-w-4xl flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground">
            Wer wir sind und was uns bewegt
          </p>
        </div>

        {/* Content Cards */}
        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <span className="text-xl font-semibold">Unsere Mission</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Der Fotowettbewerb Bernbeuren ist eine Initiative, die Fotografie
              und Gemeinschaft zusammenbringt. Wir glauben daran, dass jeder
              Mensch eine einzigartige Perspektive hat und diese durch die Kunst
              der Fotografie teilen kann.
            </p>
            <p>
              Unser Ziel ist es, eine Plattform zu schaffen, auf der Fotografen
              aus der Region und darüber hinaus ihre Werke präsentieren,
              miteinander in Wettbewerb treten und voneinander lernen können.
            </p>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-primary" />
                <span className="text-xl font-semibold">Unsere Werte</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>Kreativität</strong> - Wir fördern künstlerischen
                Ausdruck und innovative Perspektiven
              </li>
              <li>
                <strong>Gemeinschaft</strong> - Wir schaffen einen Raum für
                Austausch und gegenseitige Inspiration
              </li>
              <li>
                <strong>Fairness</strong> - Wir gewährleisten einen
                transparenten und gerechten Wettbewerb
              </li>
              <li>
                <strong>Qualität</strong> - Wir setzen auf hohe Standards bei
                allen eingereichten Arbeiten
              </li>
            </ul>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-primary" />
                <span className="text-xl font-semibold">Unser Team</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Hinter dem Fotowettbewerb Bernbeuren steht ein engagiertes Team
              aus Fotografie-Enthusiasten, Organisatoren und Freiwilligen. Wir
              arbeiten ehrenamtlich daran, diesen Wettbewerb zu einem
              unvergesslichen Erlebnis für alle Teilnehmer zu machen.
            </p>
            <p>
              Von der technischen Umsetzung über die Juryarbeit bis hin zur
              Organisation der Ausstellung - jeder im Team trägt mit seiner
              Expertise und Leidenschaft zum Erfolg des Wettbewerbs bei.
            </p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
