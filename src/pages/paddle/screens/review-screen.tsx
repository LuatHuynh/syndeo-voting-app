import { Button, Input, Radio } from "zmp-ui";

type ReviewScreenProps = {
  isHost: boolean;
  venueRating: number;
  onVenueRatingChange: (rating: number) => void;
  onSubmit: () => void;
};

export default function ReviewScreen({
  isHost,
  venueRating,
  onVenueRatingChange,
  onSubmit,
}: ReviewScreenProps) {
  return (
    <main className="paddle-content">
      <section className="paddle-review-intro">
        <span className="paddle-avatar large">PH</span>
        <p className="paddle-eyebrow">Sau buổi chơi</p>
        <h2>Đánh giá trải nghiệm</h2>
        <span>Padel Hub · Host: Minh Anh</span>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Chất lượng sân / host</p>
        <div
          className="paddle-stars"
          role="radiogroup"
          aria-label="Đánh giá chất lượng sân và host"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={venueRating === rating}
              aria-label={`${rating} sao`}
              onClick={() => onVenueRatingChange(rating)}
            >
              {rating <= venueRating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <Input.TextArea
          id="venue-review-note"
          name="venueReviewNote"
          label="Ghi chú"
          placeholder="Chia sẻ điều bạn thấy hữu ích..."
          autoHeight
        />
      </section>
      {isHost && (
        <section className="paddle-section">
          <p className="paddle-eyebrow">Người chơi</p>
          <h2>Đánh giá Quang Huy</h2>
          <Radio.Group
            name="playerLevel"
            className="paddle-level-options"
            defaultValue="tb-plus"
            options={[
              { id: "level-tb", value: "tb", label: "TB" },
              { id: "level-tb-plus", value: "tb-plus", label: "TB+" },
              { id: "level-kha", value: "kha", label: "Khá" },
            ]}
          />
        </section>
      )}
      <Button
        className="paddle-primary-button paddle-bottom-action"
        fullWidth
        onClick={onSubmit}
      >
        Gửi đánh giá
      </Button>
    </main>
  );
}
