import Checkbox from "./Checkbox";

const SocialMediaCheckboxes = ({
  selectedPlatforms,
  handlePlatformSelection,
}) => {
  return (
    <>
      <Checkbox
        key="insta"
        selected={selectedPlatforms.includes("insta")}
        setSelected={() => handlePlatformSelection("insta")}
        value="insta"
        isCheckbox={true}
        title={<img src="/images/insta.png" className="radio-img" />}
      />
      <Checkbox
        key="facebook"
        selected={selectedPlatforms.includes("facebook")}
        setSelected={() => handlePlatformSelection("facebook")}
        value="facebook"
        isCheckbox={true}
        title={<img src="/images/facebook.png" className="radio-img" />}
      />
      <Checkbox
        key="youtube"
        selected={selectedPlatforms.includes("youtube")}
        setSelected={() => handlePlatformSelection("youtube")}
        value="youtube"
        isCheckbox={true}
        title={<img src="/images/youtube.png" className="radio-img" />}
      />
      <Checkbox
        key="tiktok"
        selected={selectedPlatforms.includes("tiktok")}
        setSelected={() => handlePlatformSelection("tiktok")}
        value="tiktok"
        isCheckbox={true}
        title={<img src="/images/tiktok.png" className="radio-img" />}
      />
    </>
  );
};

export default SocialMediaCheckboxes;
