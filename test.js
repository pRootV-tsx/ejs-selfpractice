const objects = {
  name: 'Pruthviraj',
  age: 10,
  penName: {
    name2: function (el) {
      console.log(this.name);
      console.log(this.age);
      return el === this.age;
    },
  },
};

const map = (name) => {
  const boundName2 = objects.penName.name2.bind(objects.penName); // Create a bound function
  console.log(boundName2('Pruthviraj'));
};

map();

console.log(this.window);
