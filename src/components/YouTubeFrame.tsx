import { useTranslation } from 'react-i18next'

type YouTubeFrameProps = {
  youtubeId: string
  title: string
  accent: string
  isPlaying: boolean
  onPlay: () => void
  fill?: boolean
}

export function YouTubeFrame({
  youtubeId,
  title,
  accent,
  isPlaying,
  onPlay,
  fill = false,
}: YouTubeFrameProps) {
  const { t } = useTranslation()
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black/90 md:rounded-2xl ${
        fill ? 'h-full w-full min-h-0' : 'aspect-video w-full'
      }`}
    >
      {isPlaying ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={onPlay}
          className="group/play absolute inset-0 h-full w-full"
          aria-label={t('compare.playMv')}
        >
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover opacity-90 transition group-hover/play:opacity-100"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span
              className={`flex items-center justify-center rounded-full text-white shadow-lift transition group-hover/play:scale-105 ${
                fill ? 'h-10 w-10 md:h-14 md:w-14' : 'h-14 w-14'
              }`}
              style={{ background: accent }}
            >
              <svg
                viewBox="0 0 24 24"
                className={`ml-0.5 fill-current ${fill ? 'h-4 w-4 md:h-6 md:w-6' : 'h-6 w-6'}`}
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
