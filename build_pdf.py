"""Build the offline PDF companion (5 main pages + 4 optional appendix pages)."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from PIL import Image
ROOT=Path(__file__).parent
OUT=ROOT/'professor-briefing.pdf'
W,H=960,540
NAVY=HexColor('#102a4c'); VIOLET=HexColor('#613983'); DARK=HexColor('#4b286f')
INK=HexColor('#1e3047'); MUTED=HexColor('#536376'); PALE=HexColor('#f5f7fa'); LINE=HexColor('#dce3ec')
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('Academic Background and Project Experience | Jose Aldonate')
c.setAuthor('Jose Aldonate')
def para(x,y,string,size=16,width=500,color=INK,bold=False,leading=None):
    style=ParagraphStyle('x',fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,leading=leading or size*1.32,textColor=color)
    p=Paragraph(escape(string),style); _,h=p.wrap(width,H);p.drawOn(c,x,y-h);return y-h
def rect(x,y,w,h,fill):
    c.setFillColor(fill);c.rect(x,y,w,h,fill=1,stroke=0)
def base(n,section,appendix=False):
    rect(0,0,W,H,white);rect(0,484,W,56,NAVY);rect(36,498,4,25,VIOLET)
    para(55,519,'JOSE ALDONATE  /  ACADEMIC PROFILE',10,520,white,True)
    para(44,455,section.upper(),10,850,VIOLET,True)
    c.setStrokeColor(LINE);c.line(44,37,916,37)
    para(44,32,'UNI, PERU  /  JBNU, KOREA',9,440,MUTED)
    para(851,32,f'{n:02d} / 09',9,66,MUTED)
def title(a,b,x=44,y=422,size=41,width=880):
    y=para(x,y,a,size,width,NAVY,True,leading=size*1.13)
    return para(x,y-2,b,size,width,VIOLET,True,leading=size*1.13)
def image(name,x,y,w,h,crop=True):
    path=ROOT/'assets'/name
    with Image.open(path) as source:
        im=source.convert('RGB'); iw,ih=im.size
        if crop:
            if iw/ih>w/h: nw=round(ih*w/h); left=(iw-nw)//2;im=im.crop((left,0,left+nw,ih))
            else: nh=round(iw*h/w); top=(ih-nh)//2;im=im.crop((0,top,iw,top+nh))
            c.drawImage(ImageReader(im),x,y,w,h)
        else:
            scale=min(w/iw,h/ih);dw,dh=iw*scale,ih*scale
            c.drawImage(ImageReader(im),x+(w-dw)/2,y+(h-dh)/2,dw,dh)
def caption(x,y,t,w=390):para(x,y,t,9,w,MUTED)
def nextpage():c.showPage()
# 1
base(1,'01 / Introduction');title('Academic background','and project experience',y=408,size=48)
rect(44,270,70,4,VIOLET)
para(44,250,'Mechatronics Engineering | National University of Engineering, Peru',19,830,MUTED)
para(44,213,'Exchange studies | Jeonbuk National University, Republic of Korea',19,830,MUTED)
rect(44,94,872,68,PALE)
para(62,148,'Jose Aldonate',19,250,NAVY,True)
para(302,148,'Academic conversation | School of International Engineering and Science',14,580,MUTED)
nextpage()
# 2
base(2,'02 / Academic foundation · UNI');title('Training across','connected disciplines',size=43)
items=[('01 / ELECTRONICS','Circuits and design','Electric circuits, electronic and digital circuit design, laboratory work.','Hardware interfaces and valve-control circuitry.'),('02 / EMBEDDED SYSTEMS','Sensing and control','Sensors, embedded systems and classical control.','STM32 programming, sensor integration and testing.'),('03 / COMPUTING','Programming and methods','Object-oriented programming, numerical methods and mathematics.','Tools linking physical systems and software.')]
for i,(tag,head,courses,result) in enumerate(items):
    x=44+i*294;rect(x,123,280,184,PALE);rect(x,303,280,4,VIOLET if i==1 else NAVY)
    para(x+14,289,tag,10,252,VIOLET,True);para(x+14,265,head,18,252,NAVY,True)
    para(x+14,229,courses,13,252,MUTED)
    para(x+14,164,'APPLICATION',10,252,VIOLET,True);para(x+14,148,result,12,252,INK)
para(44,94,'Course groups are based on the UNI academic record; project examples are applications, not formal course outcomes.',11,872,MUTED)
nextpage()
# 3
base(3,'03 / Research project · Peru, 2025');title('Smart irrigation','research project',size=39,width=540)
para(44,292,'ITS & Smart City Institute | UNI',15,445,NAVY,True)
para(44,266,'One of the student leads. Coordinated activities and worked on STM32 programming and LoRaWAN setup.',15,440,INK)
para(44,187,'Field investigation and component tests; the planned field deployment was not completed.',13,430,MUTED)
for i,(name,tag) in enumerate([('field-visit.jpg','Field visit'),('valve-test.jpg','Valve tests'),('valve-detail.jpg','Valve assembly'),('electronics.jpg','Electronics')]):
    x=506+(i%2)*210;y=246-(i//2)*171
    image(name,x,y,200,153);rect(x,y,200,22,NAVY);para(x+8,y+17,tag,10,180,white,True)
nextpage()
# 4
base(4,'04 / Exchange studies · JBNU');title('From interdisciplinary study','to a student service',size=39,width=890)
for y,tag,body in [(286,'FIRST SEMESTER','Introductory AI study; Engineering Science Capstone Design I, including document-information extraction.'),(208,'CURRENT SEMESTER','Web Service Design and Digital Vision and Motion: software and programming with hardware.'),(130,'APPLIED PROJECT','Chambit Menu: daily meals, English descriptions and visual previews for international students.')]:
    para(44,y,tag,10,460,VIOLET,True);para(44,y-19,body,13,448,MUTED)
for name,x in [('menu-visual-a.jpg',626),('menu-visual-b.jpg',782)]:image(name,x,84,134,290,crop=False)
nextpage()
# 5
base(5,'05 / Academic continuity');title('Continuing academic','development at JBNU',y=414,size=44)
para(44,276,'My background in mechatronics and exchange studies have strengthened my interest in interdisciplinary engineering, software services and the practical use of AI tools.',19,831,INK)
para(44,190,'I hope to develop technical depth through coursework and collaborative projects while contributing to the university community.',17,831,MUTED)
rect(44,118,74,4,VIOLET);para(44,107,'Thank you for your time and consideration.',16,770,NAVY)
para(44,75,'Jose Aldonate',14,500,VIOLET,True)
nextpage()
# 6
base(6,'Appendix / Peru project 01 · field and design',True);title('Field context and','system design',size=38)
para(44,300,'The team visited Fundo Casa Blanca to investigate the irrigation context. The materials propose STM32-based nodes, sensors, a gateway and a bistable valve.',15,415,INK)
para(44,201,'Proposed architecture is not evidence of completed field deployment.',13,410,MUTED)
image('field-visit.jpg',502,235,186,155);image('irrigation-system.jpg',697,235,214,155,crop=False)
caption(502,222,'Field investigation and proposed system arrangement',402)
nextpage()
# 7
base(7,'Appendix / Peru project 02 · tests',True);title('Prototype tests and','documented progress',size=38)
para(44,300,'The team tested a valve-and-water apparatus; the research deck shows device traffic in ChirpStack. The modified Embedded Systems course configuration is not the same as a finished field design.',15,416,INK)
para(44,180,'No measured water savings or completed AI irrigation controller is claimed.',13,412,MUTED)
image('valve-test.jpg',502,220,185,166);image('lorawan-evidence.jpg',697,220,214,166,crop=False)
caption(502,209,'Lab tests and recorded LoRaWAN frames',405)
nextpage()
# 8
base(8,'Appendix / Chambit Menu 01 · service',True);title('A service for','international students',size=38)
para(44,290,'Chambit Menu combines daily cafeteria information, English descriptions and AI-assisted visual previews. It connects coursework with implementation, accuracy review and iteration.',16,458,INK)
image('menu-visual-a.jpg',591,104,142,275,crop=False);image('menu-visual-b.jpg',749,104,142,275,crop=False)
nextpage()
# 9
base(9,'Appendix / Chambit Menu 02 · usage evidence',True);title('Usage with','clear definitions',size=38)
rect(44,162,412,170,PALE);para(63,312,'HISTORICAL DASHBOARD SNAPSHOT',11,370,VIOLET,True)
para(63,278,'390',66,362,NAVY,True)
para(63,184,'Dashboard label: "Total users" | 28 Oct 2026',12,370,MUTED)
para(486,313,'DAILY USERS AND 7-DAY AVERAGE',13,405,VIOLET,True)
para(486,278,'Not included in this static PDF. Add verified dated daily figures to the website for bars; seven consecutive days are needed for an average.',16,403,INK)
para(486,197,'Source: earlier presidential briefing, p. 7. The 390 snapshot is neither a confirmed weekly average nor a current value.',12,410,MUTED)
nextpage();c.save();print(OUT)
