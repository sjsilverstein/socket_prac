from flask import Flask, request
import json, math
 
app = Flask(__name__)
 
@app.route('/')
def index():
	return "Flask server"
 
@app.route('/postdata', methods = ['POST'])
def postdata():
    data = request.get_json()
    print ("********TEST********")
    print(data)
    print(data['x_value'])
    newdata = {'y_value': math.sin(data['x_value'])}
    # do something with this data variable that contains the data from the node server
    return json.dumps({"newdata":newdata})
 
if __name__ == "__main__":
	app.run(port=5000)