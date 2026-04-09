export default function VideoPlayer({ url }: { url?: string }) {
  if (!url) return null

  return (
    <div className="mb-8">
      <video
        controls
        className="w-full h-64 bg-black rounded-2xl object-cover"
        controlsList="nodownload"
      >
        <source src={url} type="video/mp4" />
        Shfletuesi yt nuk mbështet videon.
      </video>
    </div>
  )
}
