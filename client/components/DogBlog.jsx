import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Image, Card } from "react-bootstrap";
import axios from "axios";

function DogBlog() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [userId, setUserId] = useState(user._id);
  const [dogStory, setDogStory] = useState([]);
  const [dogArray, setDogArray] = useState([]);
  const [dogPic, setDogPic] = useState("");

  // get users dogs from db and set breeds list
  const getDogs = () => {
    axios
      .get(`/dog/users/${userId}`)
      .then(({ data }) => {
        setDogArray(data.dogsArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // create a function to send request to server to make external api call, needs to take in dog details**POST
  const getStory = (dog, breed, owner) => {
    axios(`/dog/story/${dog}/breeds/${breed}/owners/${owner}/`)
      .then(({ data }) => {
        setDogStory(data.stories.reverse());
      })
      .catch((err) => console.log(err, "post story failed"));
  };
  // delete request to db
  const deleteStory = (storyId) => {
    axios
    .delete(`dog/story/${storyId}`)
    .then(({ data }) => {
      setDogStory(data.stories.reverse());
    })
    .catch((err) => console.log(err))
  }
  // update like count on db
  const likeStory = (storyId) => {
    axios
    .put(`dog/story/${storyId}`)
    .then(({ data }) => {
      setDogStory(data.stories.reverse());
    })
    .catch((err) => console.log(err))
  }
  // render a component that shows current dogs you possess
  const dogList2 =
    dogArray.length === 0 ? (
      <div> Go buy a dog from the kennel!</div>
    ) : (
      dogArray.map((dog, index) => {
        return (
          <Col key={index}>
            <Image src={dog.img} style={{ width: "250px" }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title id="dog-name">{dog.name}</Card.Title>
              <Button
                variant="primary"
                type="submit"
                onClick={() =>
                  handleClick(dog.name, dog.breed, user.username, dog.img)
                }
              >
                Check out {dog.name}'s blog!
              </Button>
            </Card.Body>
          </Col>
        );
      })
    );

  // create an element for the dog story
  const story =
    dogStory.length === 0 ? (
      <h2>My life as a dog...</h2>
    ) : (
      <div>
        {dogStory.map((story, index) => {
          return (
            <Card key={index} className="blog-container my-2 p-2">
              <div>
                <Image
                  className="dog-image p-2"
                  src={dogPic}
                  roundedCircle
                  style={{ width: "150px" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>My life as a dog...</Card.Title>
                  <Card.Text>{story.date}</Card.Text>
                  <Card.Text>Likes: {story.likes}</Card.Text>
                  <Card.Text>{story.story}</Card.Text>
                </Card.Body>
              </div>
              <div className="d-flex align-items-center justify-content-middle mx-4">
                <Button variant="primary" onClick={() => likeStory(story._id)}>
                  Like this post!
                </Button>
              </div>
              <div className="d-flex align-items-center justify-content-middle mx-4">
                <Button variant="secondary" onClick={() => deleteStory(story._id)}>
                  Delete this post
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );

  // create a handle click function to call axios request and render returned story with data
  const handleClick = (dog, breed, owner, img) => {
    getStory(dog, breed, owner);
    setDogPic(img);
  };

  useEffect(() => {
    setUserId(user._id);
    getDogs();
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={1}></Col>
        <Col
          xs={10}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>The Dog Blog</h1>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col>{dogList2}</Col>
        <Col xs={1}></Col>
      </Row>
      <Row>{story}</Row>
    </Container>
  );
}

export default DogBlog;
