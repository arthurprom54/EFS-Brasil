"""Gera 'EFS Condensed' (WOFF) a partir da Inter Display Black, comprimida em X."""
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.fontBuilder import FontBuilder
from fontTools import subset
SX=.54
src='/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
f=TTFont(src)
opts=subset.Options(); opts.layout_features=['kern']; opts.name_IDs=[1,2]; opts.notdef_outline=True
sub=subset.Subsetter(opts)
chars=list(range(0x20,0x7f))+list(range(0xa0,0x180))+[0x2013,0x2014,0x2018,0x2019,0x201c,0x201d,0x2022,0x2026,0x2192,0x00ba,0x00aa]
sub.populate(unicodes=chars); sub.subset(f)
gs=f.getGlyphSet(); order=f.getGlyphOrder(); cmap=f.getBestCmap()
glyphs={}; metrics={}
for n in order:
    g=gs[n]; tp=TTGlyphPen(None)
    g.draw(Cu2QuPen(TransformPen(tp,(SX,0,0,1,0,0)),1.0,reverse_direction=True))
    glyphs[n]=tp.glyph(); metrics[n]=(int(g.width*SX),int(g.width*SX*0)+0)
upm=f['head'].unitsPerEm
fb=FontBuilder(upm,isTTF=True); fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap)
fb.setupGlyf(glyphs)
hm={}
for n in order:
    gl=glyphs[n]; gl.recalcBounds(fb.font['glyf']) if hasattr(gl,'recalcBounds') else None
    hm[n]=(metrics[n][0],getattr(gl,'xMin',0) or 0)
fb.setupHorizontalMetrics(hm)
h=f['hhea']; os2=f['OS/2']
fb.setupHorizontalHeader(ascent=h.ascent,descent=h.descent)
fb.setupNameTable({'familyName':'EFS Condensed','styleName':'Black'})
fb.setupOS2(sTypoAscender=h.ascent,sTypoDescender=h.descent,usWinAscent=h.ascent,usWinDescent=-h.descent,sCapHeight=getattr(os2,'sCapHeight',1490),sxHeight=getattr(os2,'sxHeight',1100),usWeightClass=900)
fb.setupPost()
fb.font.flavor='woff'
fb.save('src/assets/fonts/efs-condensed.woff')
print('ok')
