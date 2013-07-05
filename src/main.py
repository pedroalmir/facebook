from google.appengine.ext.webapp.util import run_wsgi_app

import os
import webapp2
import jinja2

jinja_environment = jinja2.Environment(autoescape=True,
    loader = jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__))))

class MainPage(webapp2.RequestHandler):
    
    def get(self):
        context = {'message': 'Hello, world!'}
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(context))


application = webapp2.WSGIApplication([('/', MainPage)], debug=True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
