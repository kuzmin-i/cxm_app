import rhino3dm from "rhino3dm";

export default function handler(req, res) {
  rhino3dm().then((rhino) => {
    const sphere = new rhino.Sphere([1, 2, 3], 12);
    res.status(200).send("sdfsf " + sphere.radius);
  });

  //res.status(200).json({ name: 'John Doe' })
}
